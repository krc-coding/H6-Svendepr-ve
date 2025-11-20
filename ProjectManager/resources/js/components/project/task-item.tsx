import React from "react";
import {ITask} from "@/types/types";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

interface TaskItemProps {
    task: ITask;
    getProjectName: (projectId: number | null | undefined) => string | null | undefined;
    formatDate: (dateString: string) => string;
    onClick: (task: ITask) => void;
}

const TaskItem = (props: TaskItemProps) => {
    const {task, getProjectName, formatDate, onClick} = props;

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
            key={`task-${task.id}`}
            className={`hover:shadow-md transition-shadow cursor-pointer ${
                task.status === 'Blocked' ? 'border-orange-200 bg-orange-50' : ''
            }`}
            onClick={() => onClick(task)}
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <Badge
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                        Task
                    </Badge>
                    <Badge
                        variant="outline"
                        className={`text-xs ${getStatusBadgeColor(task.status)}`}
                    >
                        {task.status}
                    </Badge>
                </div>
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <CardDescription className="text-sm">
                    {task.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex flex-col space-y-2">
                    {task.project_id && (
                        <div className="text-xs">
                            Project: {task.project_id}
                        </div>
                    )}
                    {task.created_by && (
                        <div className="text-xs">
                            Created by: {task.created_by}
                        </div>
                    )}
                    <div className="flex justify-between items-center text-xs">
                        {task.created_at && (
                            <div className="text-xs">
                                Created: {formatDate(task.created_at)}
                            </div>
                        )}
                        <div
                            style={{color: isOverdue(task.due_date) ? 'red' : 'inherit'}}
                            className={`text-xs ${isOverdue(task.due_date) ? 'font-medium' : ''}`}
                        >
                            Due: {formatDate(task.due_date)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default TaskItem;
