import {Head} from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Tabs from "@/components/profile/tabs";
export default function UserManagementPage() {
    return (
        <AppLayout>
            <Head title="User profile" />
            <div className="min-h-screen p-2" style={{ backgroundColor: '#212830' }}>
                <header className="shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">User profile</h1>
                        </div>
                    </div>
                </header>
                <Tabs />
            </div>

        </AppLayout>
    );
}
