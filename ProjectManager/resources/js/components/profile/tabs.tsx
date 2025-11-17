import React from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type PropsWithChildren } from 'react';
import Profile from "@/components/profile/profile";
import Password from "@/components/profile/password";
import TwoFactor from "@/components/profile/two-factor";

type TabItem = { title: string; disabled: boolean };

const tabItems: TabItem[] = [
    {
        title: 'Profile',
        disabled: false
    },
    {
        title: 'Password',
        disabled: false
    },
    {
        title: 'Two-Factor Auth',
        disabled: false
    },
    {
        title: 'Appearance',
        disabled: true
    },
];

const Tabs = ({ children }: PropsWithChildren) => {
    const [activeTab, setActiveTab] = React.useState<string>('profile');

    const getTabContent = () => {
        if (activeTab === 'profile') {
            return <Profile />;
        } else if (activeTab === 'password') {
            return <Password />;
        // } else if (activeTab === 'two-factor auth') {
        //     return <TwoFactor />;
        }
    }

    return (
        <div className="px-4 py-6">
            <Heading
                title="Settings"
                description="Manage your profile"
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {tabItems.map((item, index) => {
                            if (item.disabled) return null;
                            return (
                                <Button
                                    key={`${item.title}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    className={cn('w-full justify-start', {
                                        'bg-muted': activeTab === item.title.toLowerCase(),
                                    })}
                                    onClick={() => setActiveTab(item.title.toLowerCase())}
                                >
                                    {item.title}
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        {getTabContent()}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Tabs;
