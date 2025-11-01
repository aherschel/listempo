# listempo
Todo Lists On a Schedule

A modern, TypeScript-based todo list application with powerful recurring task functionality. Never forget repetitive tasks again - create templates that automatically generate tasks on a schedule (daily, weekly, or monthly).

## Features

- **Task Management**: Create, complete, and delete tasks with due dates
- **Recurring Tasks**: Set up templates that auto-generate tasks on a schedule
  - Daily recurring tasks
  - Weekly recurring tasks (choose specific day of week)
  - Monthly recurring tasks (choose specific day of month)
- **Smart Scheduling**: The app automatically checks and generates new tasks
- **Task Filtering**: View all, active, or completed tasks
- **Pause Templates**: Temporarily disable recurring templates without deleting them
- **Local Storage**: All data persists locally in your browser
- **Responsive Design**: Works great on desktop and mobile

## Technology Stack

- **TypeScript**: Type-safe application code
- **Vanilla JavaScript**: No framework dependencies
- **LocalStorage**: Client-side data persistence
- **CSS3**: Modern, responsive styling

## Getting Started

### Prerequisites

- Node.js (for TypeScript compilation)
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd listempo
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript:
```bash
npm run build
```

4. Open `index.html` in your browser, or serve it locally:
```bash
npm run serve
```

Then visit `http://localhost:8000`

### Development

To watch for changes and automatically recompile TypeScript:
```bash
npm run watch
```

## How to Use

### Creating Regular Tasks

1. Go to the "My Tasks" tab
2. Enter a task title (required)
3. Optionally add a description and due date
4. Click "Add Task"

### Creating Recurring Tasks

1. Go to the "Recurring Tasks" tab
2. Enter a task title and optional description
3. Choose a frequency:
   - **Daily**: Task is created every day
   - **Weekly**: Choose which day of the week
   - **Monthly**: Choose which day of the month
4. Click "Add Recurring Task"

The scheduler runs when you open the app and checks every minute for new tasks to generate.

### Managing Tasks

- **Complete**: Mark a task as done (it will appear crossed out)
- **Undo**: Unmark a completed task
- **Delete**: Remove a task permanently
- **Filter**: View all, active, or completed tasks

### Managing Recurring Templates

- **Pause**: Temporarily stop a template from generating new tasks
- **Resume**: Re-enable a paused template
- **Delete**: Remove a template (doesn't delete tasks already created from it)

## Project Structure

```
listempo/
├── src/
│   ├── types.ts        # TypeScript type definitions
│   ├── storage.ts      # LocalStorage interface
│   ├── scheduler.ts    # Recurring task logic
│   └── app.ts          # Main application & UI
├── dist/               # Compiled JavaScript (generated)
├── index.html          # Main HTML file
├── styles.css          # Application styles
├── package.json        # Node.js dependencies
└── tsconfig.json       # TypeScript configuration
```

## License

See LICENSE file for details.
