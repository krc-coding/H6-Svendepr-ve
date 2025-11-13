import { apiManager } from '@/lib/api-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IUser } from '@/types/types';

interface UserProps {
    user: IUser | null;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const UserConfirmDeleteModal = (props: UserProps) => {
    if (props.user == null) return null;

    const { user, open, onClose, onConfirm } = props;

    const handleSubmit = async () => {
        try {
            await apiManager.user.delete(user.id || 0);
            onConfirm();
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
                    <DialogTitle>Are you sure you want to delete: {user.name}</DialogTitle>
                </DialogHeader>
                <div>
                    All relevant data are also being delete.
                    <div className="mt-6 flex space-x-2 justify-center">
                        <Button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            Confirm
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default UserConfirmDeleteModal;
