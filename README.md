# Synergos: Assessment: Health Tracker

This is a health metrics tracking application. It allows users to record and visualize health-related data (e.g., pulse, sugar, weight, etc.) over time. Entries are grouped by timestamp, and users can expand/collapse these groups, filter them or edit/delete them individually or by group. A Bar and a Line chart are also provided for better visualization.


# Cloning & Setup 🚀

1. Clone the repository
```
git clone https://github.com/Haaris422/assessment.git
```

2. Install dependencies
```
npm install
```


3. Start the development server
```
npm run dev
```

# Libraries Used & Why 📦

| Library          | Purpose                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| **React**        | Core framework for building the UI. Enables component-based structure and hooks for state/effect management. |
| **Vite**         | Chosen as the build tool and dev server for its blazing-fast performance and modern ES module support.       |
| **Tailwind CSS** | Provides utility-first styling to rapidly build a responsive and clean UI.                                   |
| **Recharts**     | Used for creating simple, responsive bar and line charts to visualize health data trends.                    |
| **Date-fns**     | Lightweight and modern JavaScript date utility library used for formatting timestamps and dates.             |
| **React Icons**  | Used for adding clean and consistent iconography (e.g., trash icon, dropdown indicators).                    |
| **ESLint**       | Maintains code quality and consistency across the codebase with recommended rules.                           |


# Design Philosophy 🎨

Simplicity and Clarity: The interface is kept minimal and intuitive, with clear grouping of metrics by timestamp and visible control buttons for editing or deleting.

Accessibility and UX: Icons, hover states, and collapsible sections provide good user experience across themes (dark/light).

Responsive and Modular: Tailwind CSS allows for scalable styling while maintaining responsiveness across screen sizes. Components are modular and manageable for future extension.

Validation & Feedback: Inputs are validated on submission to ensure data integrity. A snackbar system provides consistent feedback to the user on all actions (e.g., success/failure).

Dark Mode Support: Fully compatible with dark mode using Tailwind’s dark: variants, ensuring accessibility and aesthetic consistency.
