import { apiManager } from '@/lib/api-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AxiosResponse } from 'axios';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

const DeleteConfirmationModal = (props: Props) => {
    const { open, onClose, onConfirm, title, description } = props;

    const handleSubmit = async () => {
        try {
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
                    <DialogTitle>{title ? title : "Are you sure you want to delete this?"}</DialogTitle>
                </DialogHeader>
                <div>
                    {description ? description : "All relevant data are also being delete."}
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

export default DeleteConfirmationModal;
