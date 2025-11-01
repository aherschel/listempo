// Notification utility for browser notifications
export class Notifications {
    /**
     * Request notification permission from the user
     */
    static async requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }
        if (Notification.permission === 'granted') {
            this.permissionGranted = true;
            return true;
        }
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            this.permissionGranted = permission === 'granted';
            return this.permissionGranted;
        }
        return false;
    }
    /**
     * Show a notification for a newly added task
     */
    static showTaskAdded(title, description, isRecurring = false) {
        if (!this.permissionGranted || Notification.permission !== 'granted') {
            return;
        }
        const notificationTitle = isRecurring
            ? '🔄 Recurring Task Added'
            : '✅ New Task Added';
        const options = {
            body: description ? `${title}\n\n${description}` : title,
            icon: '/favicon.ico', // You can customize this
            badge: '/favicon.ico',
            tag: 'task-added',
            requireInteraction: false,
            silent: false
        };
        try {
            const notification = new Notification(notificationTitle, options);
            // Auto-close notification after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
            // Focus app when notification is clicked
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
        catch (error) {
            console.error('Failed to show notification:', error);
        }
    }
}
Notifications.permissionGranted = false;
//# sourceMappingURL=notifications.js.map