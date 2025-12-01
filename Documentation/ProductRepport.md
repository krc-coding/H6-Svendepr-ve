---
title: Room booking system
---

# Project Overview

Short description of the project.

# Functional requirements:

The functional requirements to implement the MVP.

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
    - can be created as part of a project, or as a standalone task.
    - can be assigned to any amount of users.
    - Can be created by all users.
    - Can be marked as blocking other tasks.
    - Can have a status. (Open, In progress, Done, Cancelled, Blocked)
- Project management. (create, edit, delete)
    - Groups of tasks.
    - Can be assigned to a single user, who acts as project lead.
    - Can only be created by project managers.
    - List of users who have worked on the project.
    - Can have a status. (Open, In progress, Billing, Done, Cancelled)

## Dashboards

- Management overview. (kanban style board with all tasks across all projects and users)
    - Primary dashboard for project managers.
    - Only shows projects and standalone tasks.
    -
- Personalized dashboard. (Specialized for user, derives from user overview)
    - Shows all tasks/projects assigned to the user.
    -
- Project overview. (Specialized for project, derives from user overview)
    - Shows all tasks assigned to the project.
    -

---

# Missing Features

Any issues discovered during development.

---

# Domain model:

Small mermaid diagrams of the system setup.

---

# Database model:

Small mermaid diagrams of the database setup.

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
    users ||--o{ task_user: "assigned_to"
    projects ||--o{ tasks: "contains"
    projects ||--o{ users: "account_id"
    tasks ||--o{ task_user: "assigned_to_users"
    tasks ||--o{ task_dependencies: "blocks"
    tasks ||--o{ task_dependencies: "blocked_by"
    account ||--o{ users
    account ||--o{ projects
    account ||--0{ tasks
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
