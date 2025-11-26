import { useState, useEffect } from "react";
import { apiManager } from '@/lib/api-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ITask, IUser, TASK_STATUS } from '@/types/types';
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import DateTimePicker from "@/components/ui/date-time-picker";
import MultiSelectDropdown, { Items } from "@/components/ui/multi-select-dropdown";

interface TaskProps {
    open: boolean;
    oldTask: ITask | null;
    projectId?: number;
    allTasks: ITask[];
    allUsers: IUser[];
    onClose: () => void;
    onCreate: (task: ITask) => void;
    onUpdate: (task: ITask, assigned_users: number[]) => void;
    onDelete: () => void;
}

const TaskCreateModal = (props: TaskProps) => {
    const { open, oldTask, projectId, allTasks, allUsers, onClose, onCreate, onUpdate, onDelete } = props;
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [assignTo, setAssignTo] = useState<number[]>([]);
    const [blockingTasks, setBlockingTasks] = useState<number[]>([]);
    const [users, setUsers] = useState<Items[]>([]);
    const [tasks, setTasks] = useState<Items[]>([]);
    const { auth } = usePage<SharedData>().props;
    const userId = auth.user.id;

    useEffect(() => {
        setUsers(allUsers.map((user): Items => ({
            id: user.id ?? 0,
            name: user.display_name ?? "",
            show: true,
        })));
    }, [allUsers]);

    useEffect(() => {
        setTitle(oldTask?.title ?? "");
        setDescription(oldTask?.description ?? "");
        setDueDate(oldTask?.due_date ?? "");
        setAssignTo(oldTask?.assigned_users ?? []);
        setBlockingTasks(oldTask?.depends_on ?? []);
        setTasks(createTaskItemsForBlocking());
    }, [oldTask]);

    const createTaskItemsForBlocking = (): Items[] => {
        return allTasks.map((task): Items => ({
            id: task.id ?? 0,
            name: task.title ?? "",
            show: oldTask?.project_id === task.project_id
                && task.id !== oldTask?.id,
        }));
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const task: ITask = {
            title: title,
            description: description,
            due_date: dueDate,
            status: TASK_STATUS.OPEN,
            project_id: projectId,
            created_by: userId,
            assigned_users: assignTo,
            depends_on: blockingTasks,
        };

        try {
            if (oldTask == null) {
                const response = await apiManager.task.create(task);
                onCreate(response.data.data);
            }
            else {
                const response = await apiManager.task.update(oldTask?.id || 0, task);
                onUpdate(response.data.data, assignTo);
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

                    {oldTask != null && (
                        <div>
                            <label>Assign users</label>
                            <MultiSelectDropdown
                                items={users}
                                selected={assignTo}
                                onChange={setAssignTo}
                            />
                        </div>
                    )}

                    <div>
                        <label>Blocking tasks</label>
                        <MultiSelectDropdown
                            items={tasks}
                            selected={blockingTasks}
                            onChange={setBlockingTasks}
                        />
                    </div>

                    <div className="mt-6 flex space-x-2 justify-center">
                        {oldTask != null && (
                            <Button
                                type="button"
                                onClick={onDelete}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Delete
                            </Button>
                        )}

                        <Button
                            type="button"
                            onClick={onClose}
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
