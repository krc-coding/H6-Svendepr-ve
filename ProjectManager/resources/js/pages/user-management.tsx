import { useState, useEffect } from 'react';
import { apiManager } from '@/lib/api-manager';
import { IUser } from '@/types/types';
import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import UserCard from '@/components/user-management/user-card';
import AppLayout from '@/layouts/app-layout';

export default function UserManagementPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const usersResponse = await apiManager.user.getAll();
                setUsers(usersResponse.data);
            }
            catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Failed to fetch data');
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const OpenCreateUser = () => {
        console.log("Wanting to create new user!");
    }

    if (error) {
        return (
            <AppLayout>
                <Head title="User management" />
                <div className="min-h-screen" style={{ backgroundColor: '#212830' }}>
                    <header className="shadow-sm border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div>
                                <h1 className="text-2xl font-bold">User management</h1>
                            </div>
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
        )
    }

    if (loading) {
        return (
            <AppLayout>
                <Head title="User management" />
                <div className="min-h-screen" style={{ backgroundColor: '#212830' }}>
                    <header className="shadow-sm border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div>
                                <h1 className="text-2xl font-bold">User management</h1>
                            </div>
                        </div>
                    </header>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <Head title="User management" />
            <div className="min-h-screen p-2" style={{ backgroundColor: '#212830' }}>
                <header className="shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">User management</h1>
                            <Button
                                className="bg-green-500 hover:bg-green-600"
                                onClick={OpenCreateUser}
                            >
                                Create new user
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {users.map((user) => (
                            <UserCard user={user} key={'user-' + user.id} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
