const cron = require('node-cron');
const { Notification } = require('electron');

class TaskScheduler {
    constructor() {
        this.tasks = {};
    }

    scheduleTask(id, cronExpression, taskData) {
        if (this.tasks[id]) {
            this.tasks[id].stop();
        }

        const task = cron.schedule(cronExpression, () => {
            console.log(`Executing scheduled task: ${id}`);
            // Here you would execute the actual logic based on taskData
            // For example, routing a request to LLM, fetching data, etc.

            // Send native notification on completion
            if (Notification.isSupported()) {
                 new Notification({
                    title: 'Task Completed',
                    body: `Scheduled task ${id} finished successfully.`
                 }).show();
            }
        });

        this.tasks[id] = { job: task, data: taskData, cronExpression };
        console.log(`Task ${id} scheduled with expression ${cronExpression}`);
        return { success: true, message: `Task ${id} scheduled` };
    }

    cancelTask(id) {
        if (this.tasks[id]) {
            this.tasks[id].job.stop();
            delete this.tasks[id];
            console.log(`Task ${id} cancelled`);
            return { success: true, message: `Task ${id} cancelled` };
        }
        return { success: false, message: `Task ${id} not found` };
    }

    listTasks() {
        return Object.keys(this.tasks).map(id => ({
            id,
            cronExpression: this.tasks[id].cronExpression,
            data: this.tasks[id].data
        }));
    }
}

module.exports = new TaskScheduler();
