import {useState, useEffect} from 'react';
import {ITask, IProject, IUser} from '@/types/types';
import TaskItem from "@/components/project/task-item";
import ProjectItem from "@/components/project/project-item";
import {ProjectLayout} from "@/layouts/project/default-layout";
import Column from "@/components/project/column";

interface ProjectBoardProps {
    tasks: ITask[];
    projects: IProject[];
    users: IUser[];
    onTaskStatusUpdate?: (taskId: number, newStatus: string) => void;
    onProjectStatusUpdate?: (projectId: number, newStatus: string) => void;
    onTaskClicked: (task: ITask) => void;
    onProjectClicked: (project: IProject) => void;
    layout: ProjectLayout;
    refetchData: (changedData: {type: "project" | "task", data: IProject | ITask}) => void;
}

// Updated status columns to match your PHP model constants
const statusColumns = [
    {id: 'Open', title: 'Open', color: 'bg-gray-100'},
    {id: 'In process', title: 'In Process', color: 'bg-blue-100'},
    {id: 'Completed', title: 'Completed', color: 'bg-green-100'},
    {id: 'Cancelled', title: 'Cancelled', color: 'bg-red-100'},
];

export function ProjectBoard(props: ProjectBoardProps) {
    const {
        tasks,
        projects,
        users,
        onTaskStatusUpdate,
        onProjectStatusUpdate,
        onTaskClicked,
        onProjectClicked,
        layout,
        refetchData
    } = props;
    const [tasksByStatus, setTasksByStatus] = useState<Record<string, ITask[]>>({});
    const [projectsByStatus, setProjectsByStatus] = useState<Record<string, IProject[]>>({});

    useEffect(() => {
        // Group tasks by status
        const groupedTasks = statusColumns.reduce((acc, column) => {
            acc[column.id] = tasks.filter(task => task.status === column.id);
            return acc;
        }, {} as Record<string, ITask[]>);
        setTasksByStatus(groupedTasks);

        // Group projects by status (excluding 'Blocked' since projects don't have this status)
        const projectStatuses = statusColumns.filter(col => col.id !== 'Blocked');
        const groupedProjects = projectStatuses.reduce((acc, column) => {
            acc[column.id] = projects.filter(project => project.status === column.id);
            return acc;
        }, {} as Record<string, IProject[]>);
        setProjectsByStatus(groupedProjects);
    }, [tasks, projects]);

    return (
        <div className="flex gap-6 p-6 overflow-x-auto min-h-screen">
            {layout.columns.map((column) => {
                const tasksInColumn = tasksByStatus[column] || [];
                const projectsInColumn = projectsByStatus[column] || [];
                return (
                    <Column
                        key={column}
                        column={column}
                        tasks={tasksInColumn}
                        projects={projectsInColumn}
                        users={users}
                        onTaskClicked={onTaskClicked}
                        onProjectClicked={onProjectClicked}
                        layout={layout}
                        refetchData={refetchData}
                    />
                )
            })}
        </div>
    );
}
