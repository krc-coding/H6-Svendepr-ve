import {useState, useEffect} from 'react';
import {ITask, IProject} from '@/types/types';
import TaskItem from "@/components/project/task-item";
import ProjectItem from "@/components/project/project-item";
import {ProjectLayout} from "@/layouts/project/default-layout";

interface ProjectBoardProps {
    tasks: ITask[];
    projects: IProject[];
    onTaskStatusUpdate?: (taskId: number, newStatus: string) => void;
    onProjectStatusUpdate?: (projectId: number, newStatus: string) => void;
    layout: ProjectLayout;
}

// Updated status columns to match your PHP model constants
const statusColumns = [
    {id: 'Open', title: 'Open', color: 'bg-gray-100'},
    {id: 'In process', title: 'In Process', color: 'bg-blue-100'},
    {id: 'Completed', title: 'Completed', color: 'bg-green-100'},
    {id: 'Cancelled', title: 'Cancelled', color: 'bg-red-100'},
];

export function ProjectBoard({tasks, projects, onTaskStatusUpdate, onProjectStatusUpdate, layout}: ProjectBoardProps) {
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
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="flex gap-6 p-6 overflow-x-auto min-h-screen">
            {layout.columns.map((column) => {
                const tasksInColumn = tasksByStatus[column] || [];
                const projectsInColumn = projectsByStatus[column] || [];
                const totalItems = tasksInColumn.length + projectsInColumn.length;

                return (
                    <div key={column} className="flex-shrink-0 w-80">
                        <div className={`rounded-lg p-4 mb-4 flex justify-between`} style={{backgroundColor: "#151b23"}}>
                            <h3 className="font-semibold">{column}</h3>
                            <div className="text-sm mt-1">
                                {totalItems} items
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Render Projects*/}
                            {layout.showProjects && projectsInColumn.map((project) => (
                                <ProjectItem project={project} formatDate={formatDate} key={'project-' + project.id}/>
                            ))}

                            {/* Render Tasks */}
                            {layout.showTasks && tasksInColumn.map((task) => (
                                <TaskItem task={task} formatDate={formatDate} getProjectName={getProjectName}
                                          key={'task-' + task.id}/>
                            ))}

                            {/* Empty state for columns */}
                            {totalItems === 0 && (
                                <div
                                    className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                    <p className="text-sm">No items with status "{column}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
