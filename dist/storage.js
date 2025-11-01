// LocalStorage interface for tasks and recurring templates
const TASKS_KEY = 'listempo_tasks';
const RECURRING_KEY = 'listempo_recurring';
export class Storage {
    // Tasks
    static getTasks() {
        const data = localStorage.getItem(TASKS_KEY);
        return data ? JSON.parse(data) : [];
    }
    static saveTasks(tasks) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }
    static addTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        this.saveTasks(tasks);
    }
    static updateTask(taskId, updates) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            this.saveTasks(tasks);
        }
    }
    static deleteTask(taskId) {
        const tasks = this.getTasks();
        const filtered = tasks.filter(t => t.id !== taskId);
        this.saveTasks(filtered);
    }
    // Recurring Templates
    static getRecurringTemplates() {
        const data = localStorage.getItem(RECURRING_KEY);
        return data ? JSON.parse(data) : [];
    }
    static saveRecurringTemplates(templates) {
        localStorage.setItem(RECURRING_KEY, JSON.stringify(templates));
    }
    static addRecurringTemplate(template) {
        const templates = this.getRecurringTemplates();
        templates.push(template);
        this.saveRecurringTemplates(templates);
    }
    static updateRecurringTemplate(templateId, updates) {
        const templates = this.getRecurringTemplates();
        const index = templates.findIndex(t => t.id === templateId);
        if (index !== -1) {
            templates[index] = { ...templates[index], ...updates };
            this.saveRecurringTemplates(templates);
        }
    }
    static deleteRecurringTemplate(templateId) {
        const templates = this.getRecurringTemplates();
        const filtered = templates.filter(t => t.id !== templateId);
        this.saveRecurringTemplates(filtered);
    }
    static clearAll() {
        localStorage.removeItem(TASKS_KEY);
        localStorage.removeItem(RECURRING_KEY);
    }
}
//# sourceMappingURL=storage.js.map