import { Task, RecurringTemplate } from './types.js';
export declare class Storage {
    static getTasks(): Task[];
    static saveTasks(tasks: Task[]): void;
    static addTask(task: Task): void;
    static updateTask(taskId: string, updates: Partial<Task>): void;
    static deleteTask(taskId: string): void;
    static getRecurringTemplates(): RecurringTemplate[];
    static saveRecurringTemplates(templates: RecurringTemplate[]): void;
    static addRecurringTemplate(template: RecurringTemplate): void;
    static updateRecurringTemplate(templateId: string, updates: Partial<RecurringTemplate>): void;
    static deleteRecurringTemplate(templateId: string): void;
    static clearAll(): void;
}
//# sourceMappingURL=storage.d.ts.map