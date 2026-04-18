const fs = require('fs');
const path = require('path');
const { app, dialog } = require('electron');
const archiver = require('archiver');
const extract = require('extract-zip');

class BackupRestore {
    constructor() {
        this.userDataPath = app.getPath('userData');
        // Directories/files we want to back up
        this.backupTargets = ['activity_report.json', 'activity_report.csv', 'license.lic'];
    }

    async createBackup(window) {
        try {
            const { filePath } = await dialog.showSaveDialog(window, {
                title: 'Save Backup',
                defaultPath: path.join(app.getPath('documents'), `VelocityOS_Backup_${Date.now()}.zip`),
                filters: [{ name: 'Zip Archives', extensions: ['zip'] }]
            });

            if (!filePath) return { success: false, message: 'Backup cancelled' };

            return new Promise((resolve, reject) => {
                const output = fs.createWriteStream(filePath);
                const archive = archiver('zip', { zlib: { level: 9 } });

                output.on('close', () => resolve({ success: true, message: `Backup saved to ${filePath}` }));
                archive.on('error', (err) => reject({ success: false, message: err.message }));

                archive.pipe(output);

                for (const target of this.backupTargets) {
                    const targetPath = path.join(this.userDataPath, target);
                    if (fs.existsSync(targetPath)) {
                        archive.file(targetPath, { name: target });
                    }
                }

                archive.finalize();
            });
        } catch (error) {
            console.error('Backup error:', error);
            return { success: false, message: error.message };
        }
    }

    async restoreBackup(window) {
        try {
            const { filePaths } = await dialog.showOpenDialog(window, {
                title: 'Select Backup File',
                properties: ['openFile'],
                filters: [{ name: 'Zip Archives', extensions: ['zip'] }]
            });

            if (!filePaths || filePaths.length === 0) return { success: false, message: 'Restore cancelled' };

            const zipPath = filePaths[0];

            await extract(zipPath, { dir: this.userDataPath });

            return { success: true, message: 'Data restored successfully. Please restart the application.' };

        } catch (error) {
            console.error('Restore error:', error);
            return { success: false, message: error.message };
        }
    }
}

module.exports = new BackupRestore();
