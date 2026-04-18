const cron = require('node-cron');
const axios = require('axios');
const { app } = require('electron');

class SelfHealing {
    constructor() {
        this.failureCount = 0;
        this.maxFailures = 3;
        this.isDegraded = false;

        // Monitor every hour
        this.monitorTask = cron.schedule('0 * * * *', () => {
            this.checkHealth();
        });
    }

    startMonitoring() {
        this.monitorTask.start();
        console.log("Self-healing monitoring started.");
    }

    stopMonitoring() {
        this.monitorTask.stop();
        console.log("Self-healing monitoring stopped.");
    }

    async checkHealth() {
        try {
            // Check core backend server health
            const response = await axios.get('http://localhost:3000/api/metrics', { timeout: 5000 });

            if (response.status === 200) {
                console.log("Health check passed. Systems nominal.");
                if (this.isDegraded) {
                    console.log("System recovering from degraded state.");
                    this.isDegraded = false;
                }
                this.failureCount = 0; // Reset
            } else {
                throw new Error(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error(`Health check failed: ${error.message}`);
            this.handleFailure();
        }
    }

    handleFailure() {
        this.failureCount++;

        if (this.failureCount >= this.maxFailures) {
            this.enterDegradedMode();
        } else {
            this.attemptRecovery();
        }
    }

    attemptRecovery() {
        const backoffTime = Math.pow(2, this.failureCount) * 1000; // Exponential backoff (2s, 4s...)
        console.log(`Attempting recovery in ${backoffTime}ms (Attempt ${this.failureCount}/${this.maxFailures})`);

        setTimeout(() => {
            console.log("Emitting restart-server event...");
            app.emit('restart-server');
        }, backoffTime);
    }

    enterDegradedMode() {
        if (!this.isDegraded) {
            this.isDegraded = true;
            console.error("CRITICAL: Maximum failures reached. Entering degraded mode.");
            // Alert user via UI
            // mainWindow.webContents.send('system-alert', 'System is operating in degraded mode.');
        }
    }
}

module.exports = new SelfHealing();
