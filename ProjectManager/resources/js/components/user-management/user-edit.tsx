import { useState } from "react";
import { apiManager } from '@/lib/api-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IUser } from '@/types/types';

interface UserProps {
    user: IUser | null;
    open: boolean;
    onClose: () => void;
    OnUpdate: (user: IUser) => void;
}

const UserEditModal = (props: UserProps) => {
    if (!props.user) return null;

    const { user, open, onClose, OnUpdate } = props;
    const [name, setName] = useState<string>(user.display_name || "");
    const [email, setEmail] = useState<string>(user.email);
    const [role, setRole] = useState<string>(user.role);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log({ name, email, role });

        user.display_name = name;
        user.email = email;
        user.role = role;

        try {
            const response = await apiManager.user.update(user.id || 0, user);
            OnUpdate(response.data);
            onClose();
        }
        catch (error) {
            console.error("Error: ", error);
        }

    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#10101f] rounded-lg p-6">
                <DialogHeader>
                    <DialogTitle>{user.name}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-[#10101f]">
                    <div>
                        <label className="block mb-1 font-semibold">Name</label>
                        <Input
                            type="text"
                            value={name}
                            required={true}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border-gray-700"
                            placeholder="Enter your display name"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Email</label>
                        <Input
                            type="email"
                            value={email}
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border-gray-700"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded rounded-5"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Project manager">Project manager</option>
                        </select>
                    </div>

                    <div className="mt-6 flex space-x-2 justify-center">
                        <Button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            Submit
                        </Button>
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UserEditModal;
