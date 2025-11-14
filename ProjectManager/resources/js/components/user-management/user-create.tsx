import { useState } from "react";
import { apiManager } from '@/lib/api-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IUser } from '@/types/types';

interface UserProps {
    open: boolean;
    onClose: () => void;
    OnCreate: (user: IUser) => void;
}

const UserCreateModal = (props: UserProps) => {
    const { open, onClose, OnCreate } = props;
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [role, setRole] = useState<string>("User");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const user: IUser = {
            name: name,
            email: email,
            role: role,
            password: password,
            password_confirmation: passwordConfirmation
        };

        try {
            const response = await apiManager.user.create(user);
            OnCreate(response.data);
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
                    <DialogTitle>Create user</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
                    <div>
                        <label className="block mb-1 font-semibold">Name</label>
                        <Input
                            type="text"
                            value={name}
                            required={true}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border-gray-700"
                            placeholder="Enter your name"
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

                    <div>
                        <label className="block mb-1 font-semibold">Email</label>
                        <Input
                            type="password"
                            value={password}
                            required={true}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border-gray-700"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Email</label>
                        <Input
                            type="password"
                            value={passwordConfirmation}
                            required={true}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border-gray-700"
                            placeholder="Repeat your password"
                        />
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

export default UserCreateModal;
