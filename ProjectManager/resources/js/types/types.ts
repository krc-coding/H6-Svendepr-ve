export interface ITask {
    "id"?: number;
    "title": string;
    "description": string;
    "status": string;
    "project_id"?: IProject["id"] | null;
    "created_by"?: IUser["id"];
    "due_date": string;
    "created_at"?: string;
    "updated_at"?: string;
}

export interface IUser {
    "id"?: number;
    "name": string;
    "display_name"?: string;
    "email": string;
    "role": string;
    "password"?: string;
    "password_confirmation"?: string;
    "created_at"?: string;
    "updated_at"?: string;
}

export interface IProject {
    "id"?: number;
    "name": string;
    "description": string;
    "status": string;
    "project_lead_id"?: IUser["id"];
    "due_date": string;
    "created_at"?: string;
    "updated_at"?: string;
}

export const TASK_STATUS = {
    OPEN: "Open",
    IN_PROCESS: "In process",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    BLOCKED: "Blocked"
} as const;

export const PROJECT_STATUS = {
    OPEN: "Open",
    IN_PROCESS: "In process",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled"
} as const;

export type TaskStatusValue = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export type ProjectStatusValue = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];
