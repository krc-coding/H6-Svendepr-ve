import { personalizedLayout } from "@/layouts/project/default-layout";
import Dashboard from "@/pages/dashboard";

export default function PersonalizedBoard() {
    return <Dashboard projectLayout={personalizedLayout} />
}
