---
title: Room booking system
---

# Project Overview

Short description of the project.

# Functional requirements:

## Admin

- User authentication.
- user management.
    - roles (admins, project managers, users)
    - user management, only available for admins (create, edit, delete)
        - Can reset password
        - Can change roles.
    - user profile, available for all users (edit)
        - Can't change name, but can add display name.
        - Can't change roles.
        - Other info can be changed.

## Systems

- Task management. (create, edit, delete)
    - Can be created as part of a project, or as a standalone task.
    - Can be assigned to any amount of users.
    - Can be created by all users.
    - Can be marked as blocking other tasks.
    - Can have a status. (Open, In progress, Done, Cancelled)
- Project management. (create, edit, delete)
    - Can have multiple tasks in a single project.
    - Can create tasks as part of the project.
    - Can be assigned to a single user, who acts as project lead.
    - Can only be created by project managers.
    - List of users who have worked on the project, to be shown on the project card in the dashboards.
    - Can have a status. (Open, In progress, Done, Cancelled)

## Dashboards

- Management overview. (kanban style board with all tasks across all projects and users)
    - The default dashboard shows all tasks and projects.
- Personalized dashboard. (Specialized for user, derives from user overview)
    - Shows all tasks/projects assigned to/created by the user.
- Project overview. (Specialized for project derives from user overview)
    - Shows all tasks assigned to the project.

---

# Missing Features

Any issues discovered during development.

- account management:
    - Currently account exists only in the database.
    - It should be possible to see the name of the account.
    - It should be possible to update the name of the account.

- User roles:
    - You can assign a role to users.
    - Roles has no real meaning as the handling of different roles isn't fully implemented, so currently it treats all
      users as admins.

- Project overview:
    - Can't see user assigned to task, but can still assign to.

- Welcome and auth pages:
    - Missing UI overhaul.

- User profile:
    - The input fields are not styled properly.

- Updated logo.

---

# Domain model:

The system setup isn't very complex, as it's a simple project management app.

```mermaid
graph LR
;
    B[Web page]
    C[Backend]
    Q[(Database)]
    B --> C
    C --> Q
```

---

# Database model:

```mermaid
erDiagram
    users {
        id BIGINT PK
        name VARCHAR(255)
        display_name VARCHAR(255)
        account_id BIGINT FK
        email VARCHAR(255)
        role ENUM
        password VARCHAR(255)
        created_at TIMESTAMP
        updated_at TIMESTAMP
    }

    projects {
        id BIGINT PK
        name VARCHAR(255)
        description TEXT
        status ENUM
        account_id BIGINT FK
        project_lead_id BIGINT FK
        due_date DATE
        created_at TIMESTAMP
        updated_at TIMESTAMP
    }

    tasks {
        id BIGINT PK
        title VARCHAR(255)
        description TEXT
        status ENUM
        account_id BIGINT FK
        project_id BIGINT FK
        created_by_id BIGINT FK
        due_date DATE
        created_at TIMESTAMP
        updated_at TIMESTAMP
    }

    task_user {
        id BIGINT PK
        task_id BIGINT FK
        user_id BIGINT FK
        created_at TIMESTAMP
        updated_at TIMESTAMP
    }

    task_dependencies {
        id BIGINT PK
        task_id BIGINT FK
        depends_on_task_id BIGINT FK
        created_at TIMESTAMP
        updated_at TIMESTAMP
    }

    account {
        id BIGINT PK
        name VARCHAR(255)
        created_at TIMESTAMP
        updated_at TIMESTAMP
    }

    users ||--o{ projects: "project_lead"
    users ||--o{ tasks: "created_by"
    users ||--o{ task_user: "assigned_to_tasks"
    projects ||--o{ tasks: "contains"
    tasks ||--o{ task_user: "assigned_to_users"
    tasks ||--o{ task_dependencies: "blocks"
    tasks ||--o{ task_dependencies: "blocked_by"
    account ||--o{ users: ""
    account ||--o{ projects: ""
    account ||--o{ tasks: ""
```

---

# Tech stack

## Backend

- [PHP](https://www.php.net/)
- [Laravel framework](https://laravel.com/)

## Website

- [Typescript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)

## Database

- [MySQL](https://www.mysql.com/)

---

# Dev setup guide

---

# User Guide

---

# Code documentation
