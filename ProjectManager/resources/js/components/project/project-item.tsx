import React from "react";
import {IProject, ITask, IUser} from "@/types/types";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {useDrag} from "react-dnd";
import {apiManager} from "@/lib/api-manager";

interface ProjectItemProps {
    project: IProject;
    users: IUser[];
    formatDate: (dateString: string) => string;
    onClick: (project: IProject) => void;
    refetchData: (changedData: {type: "project" | "task", data: IProject | ITask}) => void;
}

const ProjectItem = (props: ProjectItemProps) => {
    const {project, users, formatDate, onClick} = props;
    const [{isDragging}, drag] = useDrag(() => ({
        type: "drop-item",
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<{column: string}>();
            if (project.status !== dropResult?.column && project.id) {
                project.status = dropResult?.column ?? project.status;
                props.refetchData({type: "project", data: project});
                apiManager.project.updateStatus(project.id, dropResult?.column ?? project.status);
            }
        }
    }));

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
        }
    }

    function isOverdue(due_date: string) {
        return false;
    }

    const getUsersAssigned = (): IUser[] => {
        return users.filter(user => project.user_worked_in_project.includes(user.id));
    }

    const makeDisplayName = (display_name: string): string => {
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
        <Card
            key={`project-${project.id}`}
            // @ts-ignore
            ref={drag}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onClick(project)}
            style={{opacity: isDragging ? 0.5 : 1}}
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <Badge
                        variant="outline"
                        className={`text-xs bg-purple-50 text-purple-700 border-purple-200`}
                    >
                        Project
                    </Badge>
                    <Badge
                        variant="outline"
                        className={`text-xs ${getStatusBadgeColor(project.status)}`}
                    >
                        {project.status}
                    </Badge>
                </div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription className="text-sm">
                    {project.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex flex-col space-y-2">
                    {project.project_lead_id && (
                        <div className="text-xs">
                            Lead: {project.project_lead_id}
                        </div>
                    )}
                    <div className="flex justify-between items-center text-xs">

                        {project.created_at && (
                            <div className="text-xs">
                                Created: {formatDate(project.created_at)}
                            </div>
                        )}
                        <div
                            style={{color: isOverdue(project.due_date) ? 'red' : 'inherit'}}
                            className={`text-xs ${isOverdue(project.due_date) ? 'font-medium' : ''}`}
                        >
                            Due: {formatDate(project.due_date)}
                        </div>
                    </div>
                </div>
            </CardContent>
            {project.user_worked_in_project.length > 0 && (
                <CardFooter className="text-sm">
                    Workers:
                    {getUsersAssigned().map(user => (
                        <div
                            className="m-1 text-sm"
                            key={`project-${project.id}-user-display-${user.id}`}
                        >
                            {makeDisplayName(user.display_name ?? "No Name")}
                        </div>
                    ))}
                </CardFooter>
            )}
        </Card>
    );
}

export default ProjectItem;
