export interface ITask {
    "id"?: number;
    "title": string;
    "description": string;
    "status": string;
    "project_id"?: IProject["id"]|null;
    "created_by"?: IUser["id"];
    "due_date": string;
    "created_at"?: string;
    "updated_at"?: string;
}

export interface IUser {
    "id"?: number;
    "name": string;
    "email": string;
}

export interface IProject {
    "id"?: number;
    "name": string;
}
