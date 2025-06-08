import { ReactNode } from 'react';
import { Metadata } from 'next';
import RedirectToHomePage from '@/components/RedirectToHomePage';

export const metadata: Metadata = {
    title: 'TechTalk Dashboard',
    description: 'TechTalk chat application dashboard',
};

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <>
            <RedirectToHomePage />
            {children}
        </>
    );
}