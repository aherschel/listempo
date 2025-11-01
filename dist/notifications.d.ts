export declare class Notifications {
    private static permissionGranted;
    /**
     * Request notification permission from the user
     */
    static requestPermission(): Promise<boolean>;
    /**
     * Show a notification for a newly added task
     */
    static showTaskAdded(title: string, description?: string, isRecurring?: boolean): void;
}
//# sourceMappingURL=notifications.d.ts.map