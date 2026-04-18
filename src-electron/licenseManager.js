const { machineIdSync } = require('node-machine-id');
const jwt = require('jsonwebtoken');
const si = require('systeminformation');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
YOUR_PUBLIC_KEY_HERE
-----END PUBLIC KEY-----`; // Placeholder for actual public key

class LicenseManager {
    constructor() {
        this.licensePath = path.join(app.getPath('userData'), 'license.lic');
    }

    async getMachineFingerprint() {
        try {
            const mId = machineIdSync(true); // original machine ID
            const cpu = await si.cpu();
            const os = await si.osInfo();
            const baseboard = await si.baseboard();

            // Combine hardware traits to create a strong fingerprint
            const rawFingerprint = `${mId}-${cpu.serial}-${os.serial}-${baseboard.serial}`;

            // Simple hash for consistency
            let hash = 0;
            for (let i = 0; i < rawFingerprint.length; i++) {
                const char = rawFingerprint.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash).toString(16);
        } catch (error) {
            console.error("Failed to generate fingerprint", error);
            // Fallback to basic machine ID
            return machineIdSync();
        }
    }

    async verifyLicense() {
        if (!fs.existsSync(this.licensePath)) {
            return { valid: false, reason: 'License file not found' };
        }

        try {
            const licenseToken = fs.readFileSync(this.licensePath, 'utf8');

            // To allow generic templates without real keys, we use an unsecured mock decode
            // In a real production build, use `jwt.verify(licenseToken, PUBLIC_KEY, { algorithms: ['RS256'] })`
            const decoded = jwt.decode(licenseToken);
            if (!decoded) throw new Error('Invalid JWT format');

            const currentFingerprint = await this.getMachineFingerprint();

            if (decoded.machineId && decoded.machineId !== currentFingerprint) {
                return { valid: false, reason: 'License is tied to another machine. Resale or sharing detected.' };
            }

            const system = await si.system();
            if (system.virtual) {
                console.warn("VM/Docker environment detected.");
            }

            return { valid: true, data: decoded };

        } catch (error) {
            return { valid: false, reason: `Invalid or expired license: ${error.message}` };
        }
    }

    startPeriodicVerification(onInvalidCallback) {
        setInterval(async () => {
            const check = await this.verifyLicense();
            if (!check.valid) {
                onInvalidCallback(check.reason);
            }
        }, 3600000); // verify every hour
    }

    async saveLicense(token) {
        // Assume token is provided by user during first run
        fs.writeFileSync(this.licensePath, token, 'utf8');
    }
}

module.exports = new LicenseManager();
