import { useEffect, useState } from "react";
import { apiManager } from '@/lib/api-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IProject, IUser } from '@/types/types';
import DateTimePicker from "@/components/ui/date-time-picker";

interface ProjectProps {
    open: boolean;
    oldProject: IProject | null;
    onClose: () => void;
    onCreate: (project: IProject) => void;
    onUpdate: (project: IProject) => void;
    onDelete: (project: IProject) => void;
}

const ProjectCreateModal = (props: ProjectProps) => {
    const { open, oldProject, onClose, onCreate, onUpdate, onDelete } = props;
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [projectManager, setProjectManager] = useState<number>(-1);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersResponse = await apiManager.user.getAllProjectManagers();
                setUsers(usersResponse.data);
            }
            catch (e) {
                console.log("Error geting user: " + e);
            }
        }

        getUsers();
    }, []);

    useEffect(() => {
        if (oldProject) {
            setName(oldProject.name);
            setDescription(oldProject.description);
            setDueDate(oldProject.due_date);

            if (users.some(u => u.id === oldProject.project_lead_id)){
                setProjectManager(oldProject.project_lead_id || 0);
            }
            else {
                setProjectManager(0);
            }
        }
        else {
            setName("");
            setDescription("");
            setDueDate("");
            setProjectManager(0);
        }
    }, [oldProject]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const project: IProject = {
            name: name,
            description: description,
            due_date: dueDate,
            status: "Open",
            project_lead_id: projectManager,
        };

        try {
            if (oldProject == null) {
                const response = await apiManager.project.create(project);
                onCreate(response.data.data);
            }
            else if (oldProject?.id !== undefined) {
                const response = await apiManager.project.update(oldProject?.id, project);
                onUpdate(response.data.data);
            }

            CloseModal();
        }
        catch (error) {
            console.error("Error: ", error);
        }
    };

    const CloseModal = () => {
        setName("");
        setDescription("");
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={CloseModal}>
            <DialogContent className="bg-[#10101f] rounded-lg p-6">
                <DialogHeader>
                    <DialogTitle>
                        {oldProject ? "Update: " + oldProject.name : "Create project"}
                    </DialogTitle>
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
                            placeholder="Enter project name"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Description</label>
                        <Input
                            type="text"
                            value={description}
                            required={true}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border-gray-700"
                            placeholder="Enter project description"
                        />
                    </div>

                    <DateTimePicker
                        firstTimeRender={oldProject?.due_date || null}
                        setDateTime={setDueDate}
                    />

                    <div>
                        <label className="block mb-1 font-semibold">Project manager</label>
                        <select
                            value={projectManager}
                            onChange={(e) =>
                                setProjectManager(Number(e.target.value))
                            }
                            className="border p-2 rounded"
                        >
                            <option
                                className="bg-[#1e2939] text-gray"
                                key={0}
                                value={0}
                                disabled
                            >
                                Select a project manager
                            </option>

                            {users.map(user => (
                                <option
                                    className="bg-[#1e2939] text-white"
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.display_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-6 flex space-x-2 justify-center">
                        {oldProject != null && (
                            <Button
                                type="button"
                                onClick={() => onDelete(oldProject)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Delete
                            </Button>
                        )}

                        <Button
                            type="button"
                            onClick={CloseModal}
                            className="bg-gray-400 hover:bg-gray-300"
                        >
                            {oldProject ? "Cancel" : "Close"}
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {oldProject ? "Save" : "Submit"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ProjectCreateModal;
