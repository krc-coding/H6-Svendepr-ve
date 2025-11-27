import {usePage} from '@inertiajs/react';
import {IProject} from '@/types/types';
import type {SharedData} from "@/types";
import { projectLayout } from "@/layouts/project/default-layout";
import Dashboard from "@/pages/dashboard";

interface ExtendedSharedData extends SharedData {
    project: IProject;
}

export default function ProjectBoardPage() {
    const {auth, project} = usePage<ExtendedSharedData>().props;

    return <Dashboard
        projectLayout={projectLayout}
        projectViewing={project}
        overrideTasks={project.tasks}
        title={`Project Board: ${project.name}`}
    />
}
