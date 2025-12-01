import React from "react";
import HeadingSmall from "@/components/heading-small";
import {Form, useForm, usePage} from "@inertiajs/react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import InputError from "@/components/input-error";
import {Button} from "@/components/ui/button";
import {Transition} from "@headlessui/react";
import type {SharedData} from "@/types";
import {apiManager} from "@/lib/api-manager";
import {IUser} from "@/types/types";

const Profile = () => {
    const {auth} = usePage<SharedData>().props;
    const [user, setUser] = React.useState<IUser>(auth.user);
    const {data, setData} = useForm(
        {
            display_name: user.display_name,
            email: user.email,
        },
    );

    const saveChanges = (event: any) => {
        event.preventDefault();
        apiManager.user.update(auth.user.id, {
            ...auth.user,
            ...data
        }).then(() => {
            setUser({
                ...auth.user,
                ...data
            });
            setData(data);
        });
    };

    return (
        <>
            <div className="space-y-6">
                <HeadingSmall
                    title="Profile information"
                    description="Update your name and email address"
                />

                <Form
                    onSubmit={saveChanges}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({processing, recentlySuccessful, errors}) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={user.name}
                                    name="name"
                                    readOnly
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="display_name">Display name</Label>

                                <Input
                                    id="display_name"
                                    className="mt-1 block w-full"
                                    value={data.display_name}
                                    onChange={(event) => setData('display_name', event.target.value)}
                                    name="display_name"
                                    required
                                    placeholder="Display name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.display_name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>

                                <Input
                                    id="role"
                                    className="mt-1 block w-full"
                                    defaultValue={user.role}
                                    name="role"
                                    readOnly
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.role}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
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
                        </>
                    )}
                </Form>
            </div>
        </>
    );
};

export default Profile;
