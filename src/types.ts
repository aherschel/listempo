// Data types for the application

export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string | null;
    completed: boolean;
    createdAt: string;
    fromRecurringId: string | null; // Reference to recurring template if auto-generated
}

export interface RecurringTemplate {
    id: string;
    title: string;
    description: string;
    frequency: Frequency;
    dayOfWeek?: number; // 0-6 for weekly tasks (0 = Sunday)
    dayOfMonth?: number; // 1-31 for monthly tasks
    startDate: string;
    lastGenerated: string | null; // Last date a task was generated
    enabled: boolean;
}
