const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class ReportingModule {
    constructor() {
        this.logPath = path.join(app.getPath('userData'), 'activity_report.json');
        this.csvPath = path.join(app.getPath('userData'), 'activity_report.csv');
        this.activities = [];
    }

    logActivity(type, message, metadata = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            type,
            message,
            metadata
        };

        this.activities.push(entry);

        // Keep last 1000 logs in memory
        if (this.activities.length > 1000) {
            this.activities.shift();
        }

        // Persist to disk periodically or on specific events in a real scenario
        this._saveLogs();
    }

    _saveLogs() {
        fs.writeFileSync(this.logPath, JSON.stringify(this.activities, null, 2), 'utf8');
    }

    exportToCSV() {
        let csvContent = "Timestamp,Type,Message,Metadata\n";

        for (const log of this.activities) {
            const safeMsg = `"${log.message.replace(/"/g, '""')}"`;
            const safeMeta = `"${JSON.stringify(log.metadata).replace(/"/g, '""')}"`;
            csvContent += `${log.timestamp},${log.type},${safeMsg},${safeMeta}\n`;
        }

        fs.writeFileSync(this.csvPath, csvContent, 'utf8');
        return this.csvPath;
    }

    getReportSummary() {
        // Generates data for a dashboard UI
        return {
            totalActions: this.activities.length,
            errors: this.activities.filter(a => a.type === 'error').length,
            lastActivity: this.activities.length > 0 ? this.activities[this.activities.length - 1] : null
        };
    }

    exportToPDF() {
        const PDFDocument = require('pdfkit');
        const pdfPath = path.join(app.getPath('userData'), 'activity_report.pdf');
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfPath));
        doc.fontSize(25).text('VelocityOS Activity Report', 100, 100);
        doc.fontSize(12);

        for (const log of this.activities) {
            doc.text(`${log.timestamp} - ${log.type}: ${log.message}`);
        }

        doc.end();
        return pdfPath;
    }

    async scheduleEmailReport(recipientEmail) {
        const nodemailer = require('nodemailer');
        // This is a generic mockup structure for nodemailer scheduling
        // In reality, we would use node-cron and real SMTP credentials
        console.log(`Scheduling daily report to ${recipientEmail}`);
        // let transporter = nodemailer.createTransport({ ... });
        // await transporter.sendMail({ from, to, subject, attachments: [ this.exportToPDF() ] });
    }
}

module.exports = new ReportingModule();
