import { IProject, ITask, IUser } from "@/types/types";
import axios from "axios";

export const apiManager = {
    "user": {
        "get": (userId: number) => {
            return axios.get('/api/user/' + userId);
        },
        "getAll": () => {
            return axios.get('/api/user');
        },
        "update": (userId: number, user: IUser) => {
            return axios.patch('/api/user/edit/' + userId, user);
        },
        "updatePassword": (userId: number, password: string, passwordConfirmed: string) => {
            return axios.patch('/api/user/update_password/' + userId, {
                "password": password,
                "password_confirmation": passwordConfirmed
            })
        },
        "delete": (userId: number) => {
            return axios.delete('/api/user/' + userId);
        }
    },
    "task": {
        "create": (task: ITask) => {
            return axios.post('/api/task/create', task);
        },
        "get": (taskId: number) => {
            return axios.get('/api/task/' + taskId);
        },
        "getAll": () => {
            return axios.get('/api/task');
        },
        "update": (taskId: number, task: ITask) => {
            return axios.patch('/api/task/edit/' + taskId, task);
        },
        "updateStatus": (taskId: number, status: string) => {
            return axios.patch('/api/task/update_status/' + taskId, { "status": status });
        },
        "delete": (taskId: number) => {
            return axios.delete('/api/task/' + taskId);
        }
    },
    "project": {
        "create": (project: IProject) => {
            return axios.post('/api/project/create', project);
        },
        "get": (projectId: number) => {
            return axios.get('/api/project/' + projectId);
        },
        "getAll": () => {
            return axios.get('/api/project');
        },
        "update": (projectId: number, project: IProject) => {
            return axios.put('/api/project/' + projectId, project);
        },
        "updateStatus": (projectId: number, status: string) => {
            return axios.patch('/api/project/update_status/' + projectId, { "status": status });
        },
        "delete": (projectId: number) => {
            return axios.delete('/api/project/' + projectId);
        }
    }
}
