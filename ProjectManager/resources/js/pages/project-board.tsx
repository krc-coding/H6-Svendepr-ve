import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ProjectBoard } from '@/components/project/base-project';
import { Button } from "@/components/ui/button";
import { ITask, IProject, TASK_STATUS, PROJECT_STATUS } from '@/types/types';
import { apiManager } from '@/lib/api-manager';
import AppLayout from "@/layouts/app-layout";
import TaskCreateModal from '@/components/task-create';

export default function ProjectBoardPage() {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTaskCreateModalOpen, setIsTaskCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [tasksResponse, projectsResponse] = await Promise.all([
                    apiManager.task.getAll(),
                    apiManager.project.getAll()
                ]);

                // Filter out any tasks with invalid statuses
                const validTasks = tasksResponse.data.filter((task: ITask) =>
                    Object.values(TASK_STATUS).includes(task.status as any)
                );

                // Filter out any projects with invalid statuses
                const validProjects = projectsResponse.data.filter((project: IProject) =>
                    Object.values(PROJECT_STATUS).includes(project.status as any)
                );

                setTasks(validTasks);
                setProjects(validProjects);

                // Log any filtered out items
                if (tasksResponse.data.length !== validTasks.length) {
                    console.warn(`Filtered out ${tasksResponse.data.length - validTasks.length} tasks with invalid statuses`);
                }
                if (projectsResponse.data.length !== validProjects.length) {
                    console.warn(`Filtered out ${projectsResponse.data.length - validProjects.length} projects with invalid statuses`);
                }

            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleTaskStatusUpdate = async (taskId: number, newStatus: string) => {
        try {
            await apiManager.task.updateStatus(taskId, newStatus);

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus as any } : task
                )
            );
        } catch (err: any) {
            console.error('Error updating task status:', err);
            setError('Failed to update task status');
        }
    };

    const handleProjectStatusUpdate = async (projectId: number, newStatus: string) => {
        try {
            await apiManager.project.updateStatus(projectId, newStatus);

            setProjects(prevProjects =>
                prevProjects.map(project =>
                    project.id === projectId ? { ...project, status: newStatus as any } : project
                )
            );
        } catch (err: any) {
            console.error('Error updating project status:', err);
            setError('Failed to update project status');
        }
    };

    const openCreateTask = () => {
        setIsTaskCreateModalOpen(true);
    }

    const closeCreateTask = () => {
        setIsTaskCreateModalOpen(false);
    }

    const onCreatedNewTask = (newTask: ITask) => {
        setTasks((prevTask) => [...prevTask, newTask]);
    }

    if (loading) {
        return (
            <AppLayout>
                <Head title="Project Board" />

                <div className="min-h-screen" style={{ backgroundColor: '#212830' }}>
                    <header className="shadow-sm border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <h1 className="text-2xl font-bold text-gray-900">Project Board</h1>
                            <p className="text-gray-600 mt-1">
                                Manage your projects and tasks with this Kanban-style board
                            </p>
                        </div>
                    </header>

                    <div className="flex items-center justify-center min-h-96">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="text-gray-600">Loading your projects and tasks...</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <Head title="Project Board" />

                <div className="min-h-screen" style={{ backgroundColor: '#212830' }}>
                    <header className="shadow-sm border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <h1 className="text-2xl font-bold text-gray-900">Project Board</h1>
                            <p className="text-gray-600 mt-1">
                                Manage your projects and tasks with this Kanban-style board
                            </p>
                        </div>
                    </header>

                    <div className="flex items-center justify-center min-h-96">
                        <div className="border border-red-200 rounded-lg p-6 max-w-md">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Project Board" />
            <div className="min-h-screen" style={{ backgroundColor: '#212830' }}>
                <header className="shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Project Board</h1>
                            <div className='flex space-x-2'>
                                <Button
                                    className="bg-[#fafafa] hover:bg-[#e7e8ecf3]"
                                    onClick={openCreateTask}
                                >
                                    Create project
                                </Button>
                                <Button
                                    className="bg-[#fafafa] hover:bg-[#e7e8ecf3]"
                                    onClick={openCreateTask}
                                >
                                    Create task
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <ProjectBoard
                    tasks={tasks}
                    projects={projects}
                    onTaskStatusUpdate={handleTaskStatusUpdate}
                    onProjectStatusUpdate={handleProjectStatusUpdate}
                />
            </div>

            <TaskCreateModal
                open={isTaskCreateModalOpen}
                projectId={null}
                onClose={closeCreateTask}
                OnCreate={onCreatedNewTask}
            />
        </AppLayout>
    );
}
