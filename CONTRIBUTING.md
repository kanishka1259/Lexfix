# Contributing to Lexfix

Thank you for your interest in contributing to Lexfix! We welcome contributions from everyone.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR-USERNAME/Lexfix.git
    cd Lexfix
    ```
3.  **Create a new branch** for your feature or bugfix:
    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b bugfix/issue-description
    ```
    *Use `feature/` for new features, `bugfix/` for bug fixes, and `chore/` for maintenance tasks.*

## Development Workflow

1.  **Install dependencies**:
    ```bash
    npm run install:all
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
    This will start both the backend and frontend services.

## Making Changes

-   **Code Style**: Please follow the existing code style. Ensure your code is clean and readable.
-   **Micro-commits**: Make small, focused commits with descriptive messages.
    -   Example: `feat: add user login component`
    -   Example: `fix: resolve crash on startup`

## Submitting a Pull Request

1.  **Push your changes** to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```
2.  **Open a Pull Request** (PR) on the main repository.
3.  **Fill out the PR template** describing your changes.
4.  **Wait for review**. We will review your PR and provide feedback.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub describing the problem or idea in detail.
# 🚀 Team Member Contribution Guide

## Objective

Maximize **Project Insights** metrics (Commit Count, PR Frequency, Issue Resolution) while delivering high-quality code for your Epic.

## 1. Your Workflow

### Step 1: Branching

ALWAYS create a new branch for every task.

- **Format:** `feature/<epic-id>-<task-name>`
- **Example:** `feature/epic1-jwt-auth`, `feature/epic2-focus-timer`

### Step 2: Micro-Commits (Maximize Stats)

Do NOT squash your work into one big commit. Break it down!

- **Target:** 10-15 commits per feature.
- **Commit Message Format:** `type(scope): description`
- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example Sequence:**

1. `chore(setup): Initialize folder structure for auth module`
2. `feat(auth): Define User schema interface`
3. `feat(auth): Add Zod validation schema for login`
4. `test(auth): Create failing test for invalid email`
5. `feat(auth): Implement login function logic`
6. `test(auth): Fix test case to pass with new logic`
   ...and so on.

### Step 3: Pull Requests (Frequency is Key)

- Open a PR as soon as you have a basic implementation (Draft Mode).
- **Target:** 3-5 PRs per Epic.
- **Description:** Use the PR template. Link to the Issue (e.g., `Closes #123`).
- **Review:** Request a review from the Repo Owner.

### Step 4: Issues

- Create an Issue for every task BEFORE you start coding.
- Close the Issue via PR.

## 2. Your Workspace

You are assigned to this specific folder (`0X-epic-name`).

- **DO NOT** modify files outside your folder without asking.
- **DO NOT** change the root `.github` workflows.
- Run `npm test` inside your folder to verify your changes.
