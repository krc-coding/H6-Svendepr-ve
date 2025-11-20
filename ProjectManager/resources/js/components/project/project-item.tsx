import React from "react";
import {IProject} from "@/types/types";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

interface ProjectItemProps {
    project: IProject;
    formatDate: (dateString: string) => string;
    onClick: (project: IProject) => void;
}

const ProjectItem = (props: ProjectItemProps) => {
    const {project, formatDate, onClick} = props;

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

    return (
        <Card
            key={`project-${project.id}`}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onClick(project)}
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
                            style={{ color: isOverdue(project.due_date) ? 'red' : 'inherit' }}
                            className={`text-xs ${isOverdue(project.due_date) ? 'font-medium' : ''}`}
                        >
                            Due: {formatDate(project.due_date)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ProjectItem;
