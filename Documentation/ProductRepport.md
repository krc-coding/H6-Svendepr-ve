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

---

# Tech stack

## Backend

- [PHP](https://www.php.net/)
- [Laravel framework](https://laravel.com/)

## Website

- [Laravel blade templates](https://laravel.com/docs/12.x/blade)

## Database

- [MySQL](https://www.mysql.com/)

---
