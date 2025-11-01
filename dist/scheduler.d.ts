import { RecurringTemplate } from './types.js';
export declare class Scheduler {
    /**
     * Check all recurring templates and generate tasks if needed
     */
    static checkAndGenerateTasks(): void;
    /**
     * Determine if a task should be generated for a template today
     */
    private static shouldGenerateTask;
    /**
     * Generate a new task from a recurring template
     */
    private static generateTaskFromTemplate;
    /**
     * Generate a unique ID
     */
    private static generateId;
    /**
     * Get a human-readable description of a recurring template's schedule
     */
    static getScheduleDescription(template: RecurringTemplate): string;
    /**
     * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
     */
    private static getOrdinalSuffix;
}
//# sourceMappingURL=scheduler.d.ts.map