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
