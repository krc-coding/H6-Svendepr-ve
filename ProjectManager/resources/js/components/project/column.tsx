import React from "react";
import ProjectItem from "@/components/project/project-item";
import TaskItem from "@/components/project/task-item";
import {IProject, ITask, IUser} from "@/types/types";
import {ProjectLayout} from "@/layouts/project/default-layout";
import {useDrop} from "react-dnd";

interface ColumnProps {
    column: string;
    tasks: ITask[];
    projects: IProject[];
    users: IUser[];
    onTaskClicked: (task: ITask) => void;
    onProjectClicked: (project: IProject) => void;
    layout: ProjectLayout;
    refetchData: (changedData: {type: "project" | "task", data: IProject | ITask}) => void;
}

const column = (props: ColumnProps) => {
    const {column, tasks, projects, users, onProjectClicked, onTaskClicked, layout, refetchData} = props;
    const totalItems = tasks.length + projects.length;
    const [, drop] = useDrop(() => ({
        accept: "drop-item",
        drop: () => ({column: column})
    }));

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getProjectName = (projectId: number | null | undefined) => {
        if (!projectId) return null;
        const project = projects.find(p => p.id === projectId);
        return project?.name;
    };

    const getCreatedByName = (userId: number | null | undefined) => {
        if (!userId) return null;
        const user = users.find(u => u.id === userId);
        return makeDisplayName(user?.display_name);
    }

    const makeDisplayName = (display_name: string | null | undefined) => {
        if (!display_name) return null;

        const trimmed = display_name.trim();

        // Take initials
        if (trimmed.includes(" ")) {
            const parts = trimmed.split(/\s+/);
            return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
        }

        // Take first two letters
        return trimmed.slice(0, 2);
    }

    return (
        // @ts-ignore
        <div className="flex-shrink-0 w-80" ref={drop}>
            <div className={`rounded-lg p-4 mb-4 flex justify-between`} style={{backgroundColor: "#151b23"}}>
                <h3 className="font-semibold">{column}</h3>
                <div className="text-sm mt-1">
                    {totalItems} items
                </div>
            </div>

            <div className="space-y-3">
                {/* Render Projects*/}
                {layout.showProjects && projects.map((project) => (
                    <ProjectItem
                        project={project}
                        users={users}
                        formatDate={formatDate}
                        makeDisplayName={makeDisplayName}
                        onClick={onProjectClicked}
                        key={'project-' + project.id}
                        refetchData={refetchData}
                    />
                ))}

                {/* Render Tasks */}
                {layout.showTasks && tasks.map((task) => (
                    <TaskItem
                        task={task}
                        formatDate={formatDate}
                        getProjectName={getProjectName}
                        getCreatedByName={getCreatedByName}
                        onClick={onTaskClicked}
                        key={'task-' + task.id}
                        refetchData={refetchData}
                    />
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
};

export default column;
