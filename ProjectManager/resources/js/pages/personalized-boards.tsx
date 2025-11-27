import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { ProjectBoard } from '@/components/project/base-project';
import { Button } from "@/components/ui/button";
import {ITask, IProject, TASK_STATUS, PROJECT_STATUS, IUser} from '@/types/types';
import { apiManager } from '@/lib/api-manager';
import AppLayout from "@/layouts/app-layout";
import TaskCreateModal from '@/components/task-create';
import ProjectCreateModal from '@/components/project-create';
import { personalizedLayout, ProjectLayout } from "@/layouts/project/default-layout";
import type { SharedData } from "@/types";
import DeleteConfirmationModal from "@/components/delete-confirmation"
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

export default function PersonalizedBoard() {
    const {auth} = usePage<SharedData>().props;
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTaskCreateModalOpen, setIsTaskCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [isProjectCreateModalOpen, setIsProjectCreateModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
    const [layout, setLayout] = useState<ProjectLayout>(personalizedLayout);

    const fetchTasksAndProjects = async () => {
        const [tasksResponse, projectsResponse] = await Promise.all([
            apiManager.task.getAll(),
            apiManager.project.getAll()
        ]);

        // Filter out any tasks with invalid statuses
        const validTasks = tasksResponse.data.filter((task: ITask) => {
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

        // Filter out any projects with invalid statuses
        const validProjects = projectsResponse.data.filter((project: IProject) => {
            let shouldShow = false;

            if (layout.showOnlyAssignedToMe && project.project_lead_id == auth.user.id) {
                shouldShow = true;
            } else if (!layout.showOnlyAssignedToMe) {
                shouldShow = true;
            }

            if (!shouldShow) return false;
            shouldShow = Object.values(PROJECT_STATUS).includes(project.status as any)
            return shouldShow;
        });

        setTasks(validTasks);
        setProjects(validProjects);

    };

    const fetchUsers = async () => {
        const userResponse = await apiManager.user.getAll();
        setUsers(userResponse.data);
    }

    useEffect(() => {
        try {
            setLoading(true);
            setError(null);
            fetchTasksAndProjects();
            fetchUsers();
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
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

    const openCreateTask = (oldTask: ITask | null = null) => {
        setSelectedTask(oldTask);
        setIsTaskCreateModalOpen(true);
    }

    const closeCreateTask = () => {
        setIsTaskCreateModalOpen(false);
        setSelectedTask(null);
    }

    const onCreatedNewTask = (newTask: ITask) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    const onTaskUpdated = (updatedTask: ITask, assigned_users: number[]) => {
        updatedTask.assigned_users = assigned_users;
        setTasks((prevTasks) =>
            prevTasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    }

    const openCreateProject = (oldProject: IProject | null = null) => {
        setSelectedProject(oldProject);
        setIsProjectCreateModalOpen(true);
    }

    const closeCreateProject = () => {
        setIsProjectCreateModalOpen(false);
        setSelectedProject(null);
    }

    const onCreatedNewProject = (newProject: IProject) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
    }

    const onProjectUpdated = (updatedProject: IProject) => {
        setProjects((prevProjects) =>
            prevProjects.map(project =>
                project.id === updatedProject.id ? updatedProject : project
            )
        );
    }

    const openDeleteTaskConfirmation = () => {
        setIsTaskCreateModalOpen(false);
        setIsDeleteConfirmationModalOpen(true);
    }

    const openDeleteProjectConfirmation = () => {
        setIsProjectCreateModalOpen(false);
        setIsDeleteConfirmationModalOpen(true);
    }

    const closeConfirmModal = () => {
        setIsDeleteConfirmationModalOpen(false);
        setSelectedTask(null);
        setSelectedProject(null);
    }

    const onConfirm = () => {
        if (selectedTask) {
            deleteTask();
        }

        if (selectedProject) {
            deleteProject();
        }
    }

    const deleteTask = async () => {
        await apiManager.task.delete(selectedTask?.id || 0);
        setTasks((prevTasks) =>
            prevTasks.filter((task) =>
                task.id !== selectedTask?.id
            )
        );
    }

    const deleteProject = async () => {
        await apiManager.project.delete(selectedProject?.id || 0);
        setProjects((prevProjects) =>
            prevProjects.filter((project) =>
                project.id !== selectedProject?.id
            )
        );
    }

    const refreshData = (changedData: {type: "project" | "task", data: IProject | ITask}) => {
        if (changedData.type === "project") {
            const project = changedData.data as IProject;
            setProjects(prevProjects => prevProjects.map(p => p.id === project.id ? project : p));
        } else {
            const task = changedData.data as ITask;
            setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? task : t));
        }
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
                                    onClick={() => openCreateProject()}
                                >
                                    Create project
                                </Button>
                                <Button
                                    className="bg-[#fafafa] hover:bg-[#e7e8ecf3]"
                                    onClick={() => openCreateTask()}
                                >
                                    Create task
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <DndProvider backend={HTML5Backend}>
                    <ProjectBoard
                        tasks={tasks}
                        projects={projects}
                        users={users}
                        onTaskStatusUpdate={handleTaskStatusUpdate}
                        onProjectStatusUpdate={handleProjectStatusUpdate}
                        onTaskClicked={openCreateTask}
                        onProjectClicked={openCreateProject}
                        layout={layout}
                        refetchData={refreshData}
                    />
                </DndProvider>
            </div>

            <TaskCreateModal
                open={isTaskCreateModalOpen}
                oldTask={selectedTask}
                allTasks={tasks}
                allUsers={users}
                onClose={closeCreateTask}
                onCreate={onCreatedNewTask}
                onUpdate={onTaskUpdated}
                onDelete={openDeleteTaskConfirmation}
            />

            <ProjectCreateModal
                open={isProjectCreateModalOpen}
                oldProject={selectedProject}
                allUsers={users}
                onClose={closeCreateProject}
                onCreate={onCreatedNewProject}
                onUpdate={onProjectUpdated}
                onDelete={openDeleteProjectConfirmation}
            />

            <DeleteConfirmationModal
                open={isDeleteConfirmationModalOpen}
                onConfirm={onConfirm}
                onClose={closeConfirmModal}
            />
        </AppLayout>
    );
}
