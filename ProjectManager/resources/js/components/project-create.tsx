import { useState } from "react";
import { apiManager } from '@/lib/api-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IProject } from '@/types/types';
import DateTimePicker from "@/components/ui/date-time-picker";
import { usePage } from "@inertiajs/react";
import { SharedData } from "@/types";

interface ProjectProps {
    open: boolean;
    onClose: () => void;
    OnCreate: (project: IProject) => void;
}

const ProjectCreateModal = (props: ProjectProps) => {
    const { open, onClose, OnCreate } = props;
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const { auth } = usePage<SharedData>().props;
    const userId = auth.user.id;

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const project: IProject = {
            name: name,
            description: description,
            due_date: dueDate,
            status: "Open",
            project_lead_id: userId,
        };

        try {
            const response = await apiManager.project.create(project);
            OnCreate(response.data.data);
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
                    <DialogTitle>Create project</DialogTitle>
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

                    <DateTimePicker setDateTime={setDueDate} />

                    <div className="mt-6 flex space-x-2 justify-center">
                        <Button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            Submit
                        </Button>
                        <Button onClick={CloseModal}>Close</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ProjectCreateModal;
