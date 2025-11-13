import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IUser } from '@/types/types';
import { Button } from "@/components/ui/button";

interface UserProps {
    user: IUser;
    onEdit: (user: IUser) => void;
}

const UserCard = (props: UserProps) => {
    const { user, onEdit } = props;

    const openUserEdit = () => {
        onEdit(user);
    }

    const deleteUser = () => {
        console.log("User to delete: " + user.id);
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'User':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            case 'Admin':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Project manager':
                return 'bg-green-50 text-green-700 border-green-200';
        }
    }

    return (
        <Card
            key={`user-${user.id}`}
            className={`hover:shadow-md transition-shadow bg-[#0c0c14]`}
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                    <div className="flex items-center justify-between">
                        {user.name}
                        <Badge
                            variant="outline"
                            className={`text-xs ${getRoleBadgeColor(user.role)}`}
                        >
                            {user.role}
                        </Badge>
                    </div>
                </CardTitle>
                <CardDescription className="text-sm">
                    {user.display_name} <br />
                    {user.email}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex space-x-2">
                    <Button
                        className="bg-yellow-400 hover:bg-yellow-500"
                        onClick={openUserEdit}
                    >
                        Edit
                    </Button>
                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={deleteUser}
                    >
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default UserCard;
