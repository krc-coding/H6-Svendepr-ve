# Code documentation (Kasper R)

## Prerequisites

The docs are written with an expectation that you have a basic understanding of:

* React
* TypeScript
* React components.

## API calls

The backend hosts an AJAX API, which is used to get all the tasks and projects.  
To make it easier to use in the code base, we created an api manager object, which handles making the requests.

The way it's structured is like this:

```ts
export const apiManager = {
    "user": {
        "create": (user: IUser) => {
            return axios.post('/api/user/create', user);
        },
        "get": (userId: number) => {
            return axios.get('/api/user/' + userId);
        },
        "getAll": () => {
            return axios.get('/api/user');
        },
        "getAllProjectManagers": () => {
            return axios.get('/api/user/project_managers');
        },
        "update": (userId: number, user: IUser) => {
            return axios.patch('/api/user/edit/' + userId, user);
        },
        "updatePassword": (userId: number, current_password: string, password: string, passwordConfirmed: string) => {
            return axios.patch('/api/user/update_password/' + userId, {
                "current_password": current_password,
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
            return axios.patch('/api/task/update_status/' + taskId, {"status": status});
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
            return axios.put('/api/project/edit/' + projectId, project);
        },
        "updateStatus": (projectId: number, status: string) => {
            return axios.patch('/api/project/update_status/' + projectId, {"status": status});
        },
        "delete": (projectId: number) => {
            return axios.delete('/api/project/' + projectId);
        }
    }
}
```

This approach makes it easy to use, as you only need to import the api-manager object, and then call the method you want
to use, say you want to get a specific project, you would do this: `apiManager.project.get(projectId)`.

## Top level pages

The top level pages are the first files loaded when a user navigates to a specific page.  
They are located in `RoomBookingApp/src/pages/`.

Each of these pages is loaded using laravel Inertia, which allows parsing backend data into React components, like the current authenticated user.

Inertia also provides many useful components for building forms.
But the most useful feature of Inertia is the connection between a laravel backend and a React frontend

## Task loading

When a user opens any of the project boards then, we need to load all related tasks and projects.
We've created this function for loading tasks and a similar one for loading projects.
```ts
const fetchTasks = async () => {
    if (!layout.showTasks) return;

    var tasks;
    if (overrideTasks != null) {
        tasks = overrideTasks;
    }
    else {
        const tasksResponse = await apiManager.task.getAll();
        tasks = tasksResponse.data;
    }

    // Filter out any tasks with invalid statuses
    const validTasks = tasks.filter((task: ITask) => {
        let shouldShow = false;

        if (layout.showOnlyCreatedByMe && task.created_by == auth.user.id) {
            shouldShow = true;
        } else if (!layout.showOnlyCreatedByMe) {
            shouldShow = true;
        } else if (layout.showOnlyAssignedToMe && task.assigned_users.includes(auth.user.id)) {
            shouldShow = true;
        } else if (!layout.showOnlyAssignedToMe) {
            shouldShow = true;
        }

        if (!shouldShow) return false;
        shouldShow = Object.values(TASK_STATUS).includes(task.status as any);
        return shouldShow;
    });

    setTasks(validTasks);
};
```

The way it works is by first checking if the board is configured to show tasks, and if it isn't, then we do an early return.  
After that, we check if the props passed to the component contain any tasks, if it does then we use that, otherwise we make a request to the backend to get all tasks.
After that, we filter out any tasks that don't have a valid status, based on the current layout settings.

Once we have all the tasks, we then filter the tasks based on the current layout settings, and task status.

## Project board structure

Project boards are split into multiple jsx components, as it makes it easier to separate the concerns of each feature.

The dashboard component is the main component for all project boards, it handles loading all the necessary data (tasks, projects and users) and loads the necessary children.

The primary components that makes up project boards are:
```xml
<Dashboard>
    <BaseProject>
        <Column>
            <ProjectItem />
            <TaskItem />
        </Column>
    </BaseProject>
</Dashboard>
```
*Each of these components are located in `ProjectManager/resources/js/components/project/` except the dashboard component, which is located in `ProjectManager/resources/js/pages/`*

The personalized board and specific project board, both wrap the dashboard component.

## Custom layout feature

We've designed a setup in which it's possible to customize the layout of the project boards.  
Currently, we only have three predefined layouts, but it was intended that the addon system would be allowed to add more layouts.

All layouts needs to follow a specific structure, which is described in the `Layout` interface.
```ts
export interface ProjectLayout {
    columns: string[];
    showTasks: boolean;
    showProjects: boolean;
    showOnlyAssignedToMe: boolean;
    showOnlyCreatedByMe: boolean;
    filter: string[];
}
```
