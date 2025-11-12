
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ITask, IProject } from '@/types/types';

interface ProjectBoardProps {
    tasks: ITask[];
    projects: IProject[];
    onTaskStatusUpdate?: (taskId: number, newStatus: string) => void;
    onProjectStatusUpdate?: (projectId: number, newStatus: string) => void;
}

// Updated status columns to match your PHP model constants
const statusColumns = [
    { id: 'Open', title: 'Open', color: 'bg-gray-100' },
    { id: 'In process', title: 'In Process', color: 'bg-blue-100' },
    { id: 'Completed', title: 'Completed', color: 'bg-green-100' },
    { id: 'Cancelled', title: 'Cancelled', color: 'bg-red-100' },
    { id: 'Blocked', title: 'Blocked', color: 'bg-orange-100' } // Only for tasks
];

export function ProjectBoard({
                                 tasks,
                                 projects,
                                 onTaskStatusUpdate,
                                 onProjectStatusUpdate
                             }: ProjectBoardProps) {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getProjectName = (projectId: number | null | undefined) => {
        if (!projectId) return null;
        const project = projects.find(p => p.id === projectId);
        return project?.name;
    };

    const handleTaskClick = (task: ITask) => {
        console.log('Task clicked:', task);
    };

    const handleProjectClick = (project: IProject) => {
        console.log('Project clicked:', project);
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Open':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            case 'In process':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Completed':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'Cancelled':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'Blocked':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="flex gap-6 p-6 overflow-x-auto min-h-screen bg-gray-50">
            {statusColumns.map((column) => {
                const tasksInColumn = tasksByStatus[column.id] || [];
                const projectsInColumn = projectsByStatus[column.id] || [];
                const totalItems = tasksInColumn.length + projectsInColumn.length;

                return (
                    <div key={column.id} className="flex-shrink-0 w-80">
                        <div className={`rounded-lg p-4 ${column.color} mb-4`}>
                            <h3 className="font-semibold text-gray-800">{column.title}</h3>
                            <div className="text-sm text-gray-600 mt-1">
                                {totalItems} items
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Render Projects (except for Blocked column) */}
                            {column.id !== 'Blocked' && projectsInColumn.map((project) => (
                                <Card
                                    key={`project-${project.id}`}
                                    className="hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handleProjectClick(project)}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                variant="outline"
                                                className={`text-xs bg-purple-50 text-purple-700 border-purple-200`}
                                            >
                                                Project
                                            </Badge>
                                            <div className={`text-xs ${isOverdue(project.due_date) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                                Due: {formatDate(project.due_date)}
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg">{project.name}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {project.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>ID: {project.id}</span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getStatusBadgeColor(project.status)}`}
                                                >
                                                    {project.status}
                                                </Badge>
                                            </div>
                                            {project.project_lead_id && (
                                                <div className="text-xs text-gray-500">
                                                    Lead: {project.project_lead_id}
                                                </div>
                                            )}
                                            {project.created_at && (
                                                <div className="text-xs text-gray-500">
                                                    Created: {formatDate(project.created_at)}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Render Tasks */}
                            {tasksInColumn.map((task) => (
                                <Card
                                    key={`task-${task.id}`}
                                    className={`hover:shadow-md transition-shadow cursor-pointer ${
                                        task.status === 'Blocked' ? 'border-orange-200 bg-orange-50' : ''
                                    }`}
                                    onClick={() => handleTaskClick(task)}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                            >
                                                Task
                                            </Badge>
                                            <div className={`text-xs ${isOverdue(task.due_date) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                                Due: {formatDate(task.due_date)}
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg">{task.title}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {task.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>ID: {task.id}</span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getStatusBadgeColor(task.status)}`}
                                                >
                                                    {task.status}
                                                </Badge>
                                            </div>
                                            {task.project_id && (
                                                <div className="text-xs text-gray-500">
                                                    Project: {getProjectName(task.project_id)}
                                                </div>
                                            )}
                                            {task.created_by && (
                                                <div className="text-xs text-gray-500">
                                                    Created by: {task.created_by}
                                                </div>
                                            )}
                                            {task.created_at && (
                                                <div className="text-xs text-gray-500">
                                                    Created: {formatDate(task.created_at)}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Empty state for columns */}
                            {totalItems === 0 && (
                                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                    <p className="text-sm">No items in {column.title}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
