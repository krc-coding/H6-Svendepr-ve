import React from "react"
import InputError from '@/components/input-error';
import {Transition} from '@headlessui/react';
import {useForm, usePage} from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {apiManager} from "@/lib/api-manager";
import {SharedData} from "@/types";

const Password = () => {
    const {auth} = usePage<SharedData>().props;
    const [errors, setErrors] = React.useState<{
        current_password?: string,
        password?: string,
        password_confirmation?: string
    }>({});
    const [processing, setProcessing] = React.useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = React.useState(false);

    const {data, setData} = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (event: any) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        apiManager.user.updatePassword(auth.user.id, data.current_password, data.password, data.password_confirmation)
            .then(() => {
                setRecentlySuccessful(true);
            }).catch(error => {
            console.log(error);
            setErrors(error.response.data.errors);
        }).finally(() => {
            setProcessing(false);
        });
    }

    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Update password"
                description="Ensure your account is using a long, random password to stay secure"
            />

            <form
                onSubmit={updatePassword}
                className="space-y-6"
            >
                <div className="grid gap-2">
                    <Label htmlFor="current_password">
                        Current password
                    </Label>

                    <Input
                        id="current_password"
                        name="current_password"
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        placeholder="Current password"
                        value={data.current_password}
                        onChange={(event) => setData('current_password', event.target.value)}
                    />

                    <InputError
                        message={errors.current_password}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">
                        New password
                    </Label>

                    <Input
                        id="password"
                        name="password"
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        placeholder="New password"
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                    />

                    <InputError message={errors.password}/>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">
                        Confirm password
                    </Label>

                    <Input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        placeholder="Confirm password"
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                    />

                    <InputError
                        message={errors.password_confirmation}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        disabled={processing}
                        data-test="update-password-button"
                    >
                        Save password
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-neutral-600">
                            Saved
                        </p>
                    </Transition>
                </div>
            </form>
        </div>
    );
};

export default Password;
