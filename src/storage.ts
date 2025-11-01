// LocalStorage interface for tasks and recurring templates

import { Task, RecurringTemplate } from './types.js';

const TASKS_KEY = 'listempo_tasks';
const RECURRING_KEY = 'listempo_recurring';

export class Storage {
    // Tasks
    static getTasks(): Task[] {
        const data = localStorage.getItem(TASKS_KEY);
        return data ? JSON.parse(data) : [];
    }

    static saveTasks(tasks: Task[]): void {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }

    static addTask(task: Task): void {
        const tasks = this.getTasks();
        tasks.push(task);
        this.saveTasks(tasks);
    }

    static updateTask(taskId: string, updates: Partial<Task>): void {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            this.saveTasks(tasks);
        }
    }

    static deleteTask(taskId: string): void {
        const tasks = this.getTasks();
        const filtered = tasks.filter(t => t.id !== taskId);
        this.saveTasks(filtered);
    }

    // Recurring Templates
    static getRecurringTemplates(): RecurringTemplate[] {
        const data = localStorage.getItem(RECURRING_KEY);
        return data ? JSON.parse(data) : [];
    }

    static saveRecurringTemplates(templates: RecurringTemplate[]): void {
        localStorage.setItem(RECURRING_KEY, JSON.stringify(templates));
    }

    static addRecurringTemplate(template: RecurringTemplate): void {
        const templates = this.getRecurringTemplates();
        templates.push(template);
        this.saveRecurringTemplates(templates);
    }

    static updateRecurringTemplate(templateId: string, updates: Partial<RecurringTemplate>): void {
        const templates = this.getRecurringTemplates();
        const index = templates.findIndex(t => t.id === templateId);
        if (index !== -1) {
            templates[index] = { ...templates[index], ...updates };
            this.saveRecurringTemplates(templates);
        }
    }

    static deleteRecurringTemplate(templateId: string): void {
        const templates = this.getRecurringTemplates();
        const filtered = templates.filter(t => t.id !== templateId);
        this.saveRecurringTemplates(filtered);
    }

    static clearAll(): void {
        localStorage.removeItem(TASKS_KEY);
        localStorage.removeItem(RECURRING_KEY);
    }
}
