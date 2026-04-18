'use client';

import React, { useState } from 'react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

export default function SchedulerPage() {
  const [tasks, setTasks] = useState<{ id: string; cronExpression: string; data: any }[]>([]);
  const [taskId, setTaskId] = useState('');
  const [cron, setCron] = useState('* * * * *');
  const [taskData, setTaskData] = useState('');
  const [message, setMessage] = useState('');

  // Note: IPC calls must use window.require if available (i.e. running in Electron)
  const isElectron = typeof window !== 'undefined' && (window as any).require;
  const ipcRenderer = isElectron ? (window as any).require('electron').ipcRenderer : null;

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipcRenderer) {
      setMessage('Electron environment not detected. Tasks cannot be scheduled.');
      return;
    }

    try {
      const parsedData = taskData ? JSON.parse(taskData) : {};
      const result = await ipcRenderer.invoke('schedule-task', { id: taskId, cron, data: parsedData });
      setMessage(result.message);
      if (result.success) {
        setTasks([...tasks.filter(t => t.id !== taskId), { id: taskId, cronExpression: cron, data: parsedData }]);
      }
    } catch (err: any) {
      setMessage('Error scheduling task: ' + err.message);
    }
  };

  const handleBackup = async () => {
    if (!ipcRenderer) {
        setMessage('Electron environment not detected.');
        return;
    }
    const result = await ipcRenderer.invoke('create-backup');
    setMessage(result.message);
  };

  const handleRestore = async () => {
    if (!ipcRenderer) {
        setMessage('Electron environment not detected.');
        return;
    }
    const result = await ipcRenderer.invoke('restore-backup');
    setMessage(result.message);
  };

  return (
    <AuthenticatedLayout>
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Task Scheduling Engine</h3>

        {message && (
          <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSchedule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Task ID</label>
            <input
              type="text"
              value={taskId}
              onChange={e => setTaskId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cron Expression</label>
            <input
              type="text"
              value={cron}
              onChange={e => setCron(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Data (JSON)</label>
            <textarea
              value={taskData}
              onChange={e => setTaskData(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border h-24"
              placeholder='{"action": "fetch", "target": "api"}'
            />
          </div>
          <button type="submit" className="bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white px-4 py-2 rounded shadow hover:shadow-lg transition">
            Schedule Task
          </button>
        </form>

        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4">Active Scheduled Tasks</h4>
          {tasks.length === 0 ? <p className="text-gray-500">No active tasks.</p> : (
            <ul className="space-y-2">
              {tasks.map(t => (
                <li key={t.id} className="p-3 border rounded">
                  <strong>{t.id}</strong> - {t.cronExpression}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Backup & Restore</h3>
        <div className="flex space-x-4">
             <button onClick={handleBackup} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                Create Backup
             </button>
             <button onClick={handleRestore} className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition">
                Restore Backup
             </button>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
