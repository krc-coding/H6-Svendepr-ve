import React from "react";
import HeadingSmall from "@/components/heading-small";
import {Form, Link, useForm, usePage} from "@inertiajs/react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import InputError from "@/components/input-error";
import {send} from "@/routes/verification";
import {Button} from "@/components/ui/button";
import {Transition} from "@headlessui/react";
import DeleteUser from "@/components/delete-user";
import type {SharedData} from "@/types";
import {apiManager} from "@/lib/api-manager";

const Profile = () => {
    const mustVerifyEmail = true;
    const status = "";
    const { auth } = usePage<SharedData>().props;
    const {data, setData} = useForm(
        {
            display_name: auth.user.display_name,
            email: auth.user.email,
        },
    );


    const saveChanges = () => {
        console.log(data);
        apiManager.user.update(auth.user.id, {
            ...auth.user,
            ...data
        });
    }

    return (
        <>
            <div className="space-y-6">
                <HeadingSmall
                    title="Profile information"
                    description="Update your name and email address"
                />

                <Form
                    onSubmitCapture={saveChanges}
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
                                    defaultValue={auth.user.name}
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

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is
                                            unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to resend the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                    </div>
                                )}

                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>

                                <Input
                                    id="role"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.role}
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

            <DeleteUser/>
        </>
    );
};

export default Profile;
