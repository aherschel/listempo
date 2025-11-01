// Main application logic and UI management

import { Task, RecurringTemplate } from './types.js';
import { Storage } from './storage.js';
import { Scheduler } from './scheduler.js';
import { Notifications } from './notifications.js';

class App {
    private currentTaskFilter: 'all' | 'active' | 'completed' = 'all';

    constructor() {
        this.init();
    }

    private init(): void {
        // Request notification permission
        Notifications.requestPermission();

        // Run scheduler on app load
        Scheduler.checkAndGenerateTasks();

        // Set up event listeners
        this.setupTabSwitching();
        this.setupTaskForm();
        this.setupRecurringForm();
        this.setupTaskFilters();

        // Initial render
        this.renderTasks();
        this.renderRecurringTemplates();

        // Check for new recurring tasks every minute
        setInterval(() => {
            Scheduler.checkAndGenerateTasks();
            this.renderTasks();
        }, 60000); // 60 seconds
    }

    // Tab Switching
    private setupTabSwitching(): void {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const tab = target.dataset.tab;
                if (!tab) return;

                // Update active tab button
                tabButtons.forEach(b => b.classList.remove('active'));
                target.classList.add('active');

                // Update active tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tab}-tab`)?.classList.add('active');
            });
        });
    }

    // Task Management
    private setupTaskForm(): void {
        const form = document.getElementById('task-form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
    }

    private addTask(): void {
        const titleInput = document.getElementById('task-title') as HTMLInputElement;
        const descriptionInput = document.getElementById('task-description') as HTMLTextAreaElement;
        const dueDateInput = document.getElementById('task-due-date') as HTMLInputElement;

        const task: Task = {
            id: this.generateId(),
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            dueDate: dueDateInput.value || null,
            completed: false,
            createdAt: new Date().toISOString(),
            fromRecurringId: null
        };

        Storage.addTask(task);
        this.renderTasks();

        // Show notification
        Notifications.showTaskAdded(task.title, task.description, false);

        // Reset form
        titleInput.value = '';
        descriptionInput.value = '';
        dueDateInput.value = '';
    }

    private toggleTaskComplete(taskId: string): void {
        const tasks = Storage.getTasks();
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            Storage.updateTask(taskId, { completed: !task.completed });
            this.renderTasks();
        }
    }

    private deleteTask(taskId: string): void {
        if (confirm('Are you sure you want to delete this task?')) {
            Storage.deleteTask(taskId);
            this.renderTasks();
        }
    }

    private setupTaskFilters(): void {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const filter = target.dataset.filter as 'all' | 'active' | 'completed';
                if (!filter) return;

                this.currentTaskFilter = filter;

                // Update active filter button
                filterButtons.forEach(b => b.classList.remove('active'));
                target.classList.add('active');

                this.renderTasks();
            });
        });
    }

    private renderTasks(): void {
        const container = document.getElementById('tasks-list');
        if (!container) return;

        let tasks = Storage.getTasks();

        // Apply filter
        if (this.currentTaskFilter === 'active') {
            tasks = tasks.filter(t => !t.completed);
        } else if (this.currentTaskFilter === 'completed') {
            tasks = tasks.filter(t => t.completed);
        }

        // Sort by due date, then by creation date
        tasks.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1; // Uncompleted first
            }
            if (a.dueDate && b.dueDate) {
                return a.dueDate.localeCompare(b.dueDate);
            }
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
            return b.createdAt.localeCompare(a.createdAt);
        });

        if (tasks.length === 0) {
            container.innerHTML = '<div class="empty-state">No tasks to show</div>';
            return;
        }

        container.innerHTML = tasks.map(task => this.renderTaskItem(task)).join('');

        // Attach event listeners
        tasks.forEach(task => {
            const completeBtn = document.querySelector(`[data-task-id="${task.id}"][data-action="complete"]`);
            const deleteBtn = document.querySelector(`[data-task-id="${task.id}"][data-action="delete"]`);

            completeBtn?.addEventListener('click', () => this.toggleTaskComplete(task.id));
            deleteBtn?.addEventListener('click', () => this.deleteTask(task.id));
        });
    }

    private renderTaskItem(task: Task): string {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
        const dueDateClass = isOverdue ? 'overdue' : '';

        return `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-header">
                    <div class="task-info">
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                        <div class="task-meta">
                            <span class="${dueDateClass}">📅 ${dueDate}</span>
                            ${task.fromRecurringId ? '<span>🔄 From recurring template</span>' : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="${task.completed ? 'uncomplete-btn' : 'complete-btn'}"
                                data-task-id="${task.id}"
                                data-action="complete">
                            ${task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button class="delete-btn"
                                data-task-id="${task.id}"
                                data-action="delete">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Recurring Template Management
    private setupRecurringForm(): void {
        const form = document.getElementById('recurring-form') as HTMLFormElement;
        const frequencySelect = document.getElementById('recurring-frequency') as HTMLSelectElement;
        const weeklyOptions = document.getElementById('weekly-options');
        const monthlyOptions = document.getElementById('monthly-options');

        // Show/hide frequency-specific options
        frequencySelect.addEventListener('change', () => {
            weeklyOptions!.style.display = frequencySelect.value === 'weekly' ? 'block' : 'none';
            monthlyOptions!.style.display = frequencySelect.value === 'monthly' ? 'block' : 'none';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addRecurringTemplate();
        });
    }

    private addRecurringTemplate(): void {
        const titleInput = document.getElementById('recurring-title') as HTMLInputElement;
        const descriptionInput = document.getElementById('recurring-description') as HTMLTextAreaElement;
        const frequencySelect = document.getElementById('recurring-frequency') as HTMLSelectElement;
        const dayOfWeekSelect = document.getElementById('recurring-day-of-week') as HTMLSelectElement;
        const dayOfMonthInput = document.getElementById('recurring-day-of-month') as HTMLInputElement;

        const template: RecurringTemplate = {
            id: this.generateId(),
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            frequency: frequencySelect.value as any,
            startDate: new Date().toISOString(),
            lastGenerated: null,
            enabled: true
        };

        if (template.frequency === 'weekly') {
            template.dayOfWeek = parseInt(dayOfWeekSelect.value);
        } else if (template.frequency === 'monthly') {
            template.dayOfMonth = parseInt(dayOfMonthInput.value);
        }

        Storage.addRecurringTemplate(template);
        this.renderRecurringTemplates();

        // Check if we should generate a task immediately
        Scheduler.checkAndGenerateTasks();
        this.renderTasks();

        // Reset form
        titleInput.value = '';
        descriptionInput.value = '';
        frequencySelect.value = 'daily';
        document.getElementById('weekly-options')!.style.display = 'none';
        document.getElementById('monthly-options')!.style.display = 'none';
    }

    private deleteRecurringTemplate(templateId: string): void {
        if (confirm('Are you sure you want to delete this recurring template?')) {
            Storage.deleteRecurringTemplate(templateId);
            this.renderRecurringTemplates();
        }
    }

    private toggleRecurringTemplate(templateId: string): void {
        const templates = Storage.getRecurringTemplates();
        const template = templates.find(t => t.id === templateId);
        if (template) {
            Storage.updateRecurringTemplate(templateId, { enabled: !template.enabled });
            this.renderRecurringTemplates();
        }
    }

    private renderRecurringTemplates(): void {
        const container = document.getElementById('recurring-list');
        if (!container) return;

        const templates = Storage.getRecurringTemplates();

        if (templates.length === 0) {
            container.innerHTML = '<div class="empty-state">No recurring templates yet</div>';
            return;
        }

        container.innerHTML = templates.map(template => this.renderRecurringItem(template)).join('');

        // Attach event listeners
        templates.forEach(template => {
            const toggleBtn = document.querySelector(`[data-template-id="${template.id}"][data-action="toggle"]`);
            const deleteBtn = document.querySelector(`[data-template-id="${template.id}"][data-action="delete"]`);

            toggleBtn?.addEventListener('click', () => this.toggleRecurringTemplate(template.id));
            deleteBtn?.addEventListener('click', () => this.deleteRecurringTemplate(template.id));
        });
    }

    private renderRecurringItem(template: RecurringTemplate): string {
        const schedule = Scheduler.getScheduleDescription(template);

        return `
            <div class="recurring-item ${!template.enabled ? 'disabled' : ''}">
                <div class="recurring-header">
                    <div class="recurring-info">
                        <div class="recurring-title">${this.escapeHtml(template.title)}</div>
                        ${template.description ? `<div class="recurring-description">${this.escapeHtml(template.description)}</div>` : ''}
                        <div class="recurring-frequency">${schedule}</div>
                        ${!template.enabled ? '<span style="color: #999; font-size: 0.9em;">⏸️ Paused</span>' : ''}
                    </div>
                    <div class="recurring-actions">
                        <button class="${template.enabled ? 'uncomplete-btn' : 'complete-btn'}"
                                data-template-id="${template.id}"
                                data-action="toggle">
                            ${template.enabled ? 'Pause' : 'Resume'}
                        </button>
                        <button class="delete-btn"
                                data-template-id="${template.id}"
                                data-action="delete">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Utility methods
    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}
