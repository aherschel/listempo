export type Frequency = 'daily' | 'weekly' | 'monthly';
export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string | null;
    completed: boolean;
    createdAt: string;
    fromRecurringId: string | null;
}
export interface RecurringTemplate {
    id: string;
    title: string;
    description: string;
    frequency: Frequency;
    dayOfWeek?: number;
    dayOfMonth?: number;
    startDate: string;
    lastGenerated: string | null;
    enabled: boolean;
}
//# sourceMappingURL=types.d.ts.map