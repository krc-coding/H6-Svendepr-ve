import { useState, useEffect } from "react";
import { apiManager } from '@/lib/api-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ITask } from '@/types/types';
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import DateTimePicker from "@/components/ui/date-time-picker";

interface TaskProps {
    open: boolean;
    oldTask: ITask | null;
    projectId: number | null;
    onClose: () => void;
    onCreate: (task: ITask) => void;
    onUpdate: (task: ITask) => void;
    onDelete: () => void;
}

const TaskCreateModal = (props: TaskProps) => {
    const { open, oldTask, projectId, onClose, onCreate, onUpdate, onDelete } = props;
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const { auth } = usePage<SharedData>().props;
    const userId = auth.user.id;

    useEffect(() => {
        if (oldTask) {
            setTitle(oldTask.title);
            setDescription(oldTask.description);
            setDueDate(oldTask.due_date);
        }
    }, [oldTask]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const task: ITask = {
            title: title,
            description: description,
            due_date: dueDate,
            status: "Open", // We don't have blocked yet
            project_id: projectId,
            created_by: userId,
        };

        try {
            if (oldTask == null) {
                const response = await apiManager.task.create(task);
                onCreate(response.data.data);
            }
            else if (oldTask?.id !== undefined) {
                const response = await apiManager.task.update(oldTask?.id, task);
                onUpdate(response.data.data)
            }

            CloseModal();
        }
        catch (error) {
            console.error("Error: ", error);
        }
    };

    const CloseModal = () => {
        setTitle("");
        setDescription("");
        onClose();
    }

    const handleDelete = async (e: { preventDefault: () => void; }) => {
        onDelete();
    }

    return (
        <Dialog open={open} onOpenChange={CloseModal}>
            <DialogContent className="bg-[#10101f] rounded-lg p-6">
                <DialogHeader>
                    <DialogTitle>{oldTask ? "Update: " + oldTask.title : "Create task"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
                    <div>
                        <label className="block mb-1 font-semibold">Title</label>
                        <Input
                            type="text"
                            value={title}
                            required={true}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border-gray-700"
                            placeholder="Enter task title"
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
                            placeholder="Enter task description"
                        />
                    </div>

                    <DateTimePicker
                        firstTimeRender={oldTask?.due_date || null}
                        setDateTime={setDueDate} />

                    <div className="mt-6 flex space-x-2 justify-center">
                        {oldTask != null && (
                            <Button
                                type="button"
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Delete
                            </Button>
                        )}

                        <Button
                            type="button"
                            onClick={CloseModal}
                            className="bg-gray-300 hover:bg-gray-400"
                        >
                            {oldTask ? "Cancel" : "Close"}
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {oldTask ? "Save" : "Submit"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default TaskCreateModal;
