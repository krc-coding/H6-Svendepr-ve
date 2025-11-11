import {ITask} from "@/types/types";
import axios from "axios";

const apiManager = {
    "task": {
        "create": (task: ITask) => {
            return axios.post('/api/task', task);
        },
        "get": (taskId: number) => {
            return axios.get('/api/task/' + taskId);
        },
        "getAll": () => {
            return axios.get('/api/task');
        },
        "update": (taskId: number, task: ITask) => {
            return axios.put('/api/task/' + taskId, task);
        },
        "delete": (taskId: number) => {
            return axios.delete('/api/task/' + taskId);
        }
    }
}
