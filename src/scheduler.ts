// Scheduling engine to auto-generate tasks from recurring templates

import { Task, RecurringTemplate } from './types.js';
import { Storage } from './storage.js';

export class Scheduler {
    /**
     * Check all recurring templates and generate tasks if needed
     */
    static checkAndGenerateTasks(): void {
        const templates = Storage.getRecurringTemplates();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        templates.forEach(template => {
            if (!template.enabled) return;

            const shouldGenerate = this.shouldGenerateTask(template, today);
            if (shouldGenerate) {
                this.generateTaskFromTemplate(template, today);
            }
        });
    }

    /**
     * Determine if a task should be generated for a template today
     */
    private static shouldGenerateTask(template: RecurringTemplate, today: Date): boolean {
        // Check if we already generated a task today
        if (template.lastGenerated) {
            const lastGen = new Date(template.lastGenerated);
            lastGen.setHours(0, 0, 0, 0);
            if (lastGen.getTime() === today.getTime()) {
                return false; // Already generated today
            }
        }

        // Check if start date has passed
        const startDate = new Date(template.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (today < startDate) {
            return false; // Haven't reached start date yet
        }

        // Check frequency-specific rules
        switch (template.frequency) {
            case 'daily':
                return true; // Generate every day

            case 'weekly':
                if (template.dayOfWeek === undefined) return false;
                return today.getDay() === template.dayOfWeek;

            case 'monthly':
                if (template.dayOfMonth === undefined) return false;
                // Handle months with fewer days (e.g., Feb 30 -> Feb 28)
                const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                const targetDay = Math.min(template.dayOfMonth, lastDayOfMonth);
                return today.getDate() === targetDay;

            default:
                return false;
        }
    }

    /**
     * Generate a new task from a recurring template
     */
    private static generateTaskFromTemplate(template: RecurringTemplate, today: Date): void {
        const task: Task = {
            id: this.generateId(),
            title: template.title,
            description: template.description,
            dueDate: today.toISOString().split('T')[0], // Set due date to today
            completed: false,
            createdAt: new Date().toISOString(),
            fromRecurringId: template.id
        };

        Storage.addTask(task);

        // Update last generated date
        Storage.updateRecurringTemplate(template.id, {
            lastGenerated: today.toISOString()
        });
    }

    /**
     * Generate a unique ID
     */
    private static generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    /**
     * Get a human-readable description of a recurring template's schedule
     */
    static getScheduleDescription(template: RecurringTemplate): string {
        switch (template.frequency) {
            case 'daily':
                return 'Every day';

            case 'weekly':
                if (template.dayOfWeek === undefined) return 'Weekly';
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return `Every ${days[template.dayOfWeek]}`;

            case 'monthly':
                if (template.dayOfMonth === undefined) return 'Monthly';
                const suffix = this.getOrdinalSuffix(template.dayOfMonth);
                return `${template.dayOfMonth}${suffix} of each month`;

            default:
                return 'Unknown schedule';
        }
    }

    /**
     * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
     */
    private static getOrdinalSuffix(num: number): string {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return 'st';
        if (j === 2 && k !== 12) return 'nd';
        if (j === 3 && k !== 13) return 'rd';
        return 'th';
    }
}
