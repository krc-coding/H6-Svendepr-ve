export interface ProjectLayout {
    columns: string[];
    showTasks: boolean;
    showProjects: boolean;
    showOnlyAssignedToMe: boolean;
    showOnlyCreatedByMe: boolean;
    filter: string[];
}

export const defaultLayout = {
    columns: ['Open', 'In process', 'Completed', 'Cancelled'],
    showTasks: true,
    showProjects: true,
    showOnlyAssignedToMe: false,
    showOnlyCreatedByMe: false,
    filter: [],
}

