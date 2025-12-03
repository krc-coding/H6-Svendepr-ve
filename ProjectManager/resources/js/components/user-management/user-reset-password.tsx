import { useState } from 'react';
import { apiManager } from '@/lib/api-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IUser } from '@/types/types';

interface UserProps {
    user: IUser | null;
    open: boolean;
    onClose: () => void;
}

const NewPasswordLength = 8;

const UserResetPassword = (props: UserProps) => {
    if (props.user == null) return null;

    const { user, open, onClose } = props;
    const [hasConfirmed, setHasConfirmed] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [newPassword, setNewPassword] = useState<string>("");

    const handleConfirm = async () => {
        try {
            const response = await apiManager.user.resetPassword(user.id || 0);
            setNewPassword(response.data);
            setHasConfirmed(true);
        }
        catch (error) {
            console.error("Error: ", error);
        }
    };
    
    const maskPassword = (str: string): string => {
        return "*".repeat(str.length);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#10101f] rounded-lg p-6">
                <DialogHeader>
                    <DialogTitle>
                        {hasConfirmed ?
                            "Remember the password "
                            : "Are you sure you want to reset the password "}

                        of: {user.name}</DialogTitle>
                </DialogHeader>
                <div>
                    {hasConfirmed && (showPassword ? newPassword : maskPassword(newPassword))}

                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        {hasConfirmed && (
                            <Button
                                onClick={togglePasswordVisibility}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </Button>
                        )}
                        {!hasConfirmed && (
                            <Button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            >
                                Confirm
                            </Button>
                        )}
                        <Button onClick={onClose}>
                            {hasConfirmed ? "Close" : "Cancel"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default UserResetPassword;
