# Git Workflow & Branch Strategy

## Branches

### main
Production-ready branch. Only stable and approved code should be merged into main.

### develop
Staging and integration branch. All completed features should be merged into develop first for testing.

### feature/*
Used for new features. Created from develop and merged back into develop through a pull request.

Example:
feature/login-page

### bugfix/*
Used for bug fixes. Created from develop and merged back into develop through a pull request.

Example:
bugfix/fix-calendar-export

## Workflow

1. Create a new branch from develop.
2. Work on the feature or bugfix.
3. Commit changes using the commit convention.
4. Push the branch to GitHub.
5. Open a Pull Request (PR) into develop.
6. Review and test the PR.
7. Merge into develop.
8. When develop is stable, open a pull request from develop into main.
9. Merge into main for production release.

## Commit Convention

feat: new feature  
fix: bug fix  
refactor: code restructuring without behavior change  
docs: documentation changes  
test: adding or updating tests  
chore: maintenance tasks  

## Pull Request Rules

- Feature and bugfix PRs should target develop.
- Release PRs should target main.
- Do not push directly to main.
- Use clear PR titles and descriptions.