import { useEffect, useState } from "react";
import { apiManager } from '@/lib/api-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IUser, USER_ROLES } from '@/types/types';

interface UserProps {
    open: boolean;
    oldUser: IUser | null;
    onClose: () => void;
    onCreate: (user: IUser) => void;
    onUpdate: (user: IUser) => void;
}

const UserCreateModal = (props: UserProps) => {
    const { open, oldUser, onClose, onCreate, onUpdate } = props;
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [role, setRole] = useState<string>(USER_ROLES.USER);
    const [password, setPassword] = useState<string>("");
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
    const roles = Object.values(USER_ROLES);

    useEffect(() => {
        setName(oldUser?.display_name ?? "");
        setEmail(oldUser?.email ?? "");
        setRole(oldUser?.role ?? USER_ROLES.USER);
        setPassword("");
        setPassword("");
    }, [oldUser]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            if (oldUser === null) {
                const newUser: IUser = {
                    name: name,
                    email: email,
                    role: role,
                    password: password,
                    password_confirmation: passwordConfirmation,
                };

                const response = await apiManager.user.create(newUser);
                onCreate(response.data.data);
            }
            else {
                const updatedUser: IUser = {
                    name: name,
                    display_name: name,
                    email: email,
                    role: role,
                };

                const response = await apiManager.user.update(oldUser.id ?? 0, updatedUser);
                onUpdate(response.data.data);
            }
        }
        catch (error) {
            console.error("Error: ", error);
        }
        finally {
            onClose();
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
                        <label className="block mb-1">Name</label>
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
                        <label className="block mb-1">Email</label>
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
                            {roles.map(role => (
                                <option
                                    value={role}
                                    key={`user-edit-${role}`}
                                >
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {oldUser == null && (
                        <>
                            <div>
                                <label className="block mb-1 font-semibold">Password</label>
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
                                <label className="block mb-1 font-semibold">Repeat password</label>
                                <Input
                                    type="password"
                                    value={passwordConfirmation}
                                    required={true}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border-gray-700"
                                    placeholder="Repeat your password"
                                />
                            </div>
                        </>
                    )}

                    <div className="mt-6 flex space-x-2 justify-center">
                        <Button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            Submit
                        </Button>
                        <Button
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UserCreateModal;
