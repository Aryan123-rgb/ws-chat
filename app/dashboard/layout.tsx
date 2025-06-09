import { ReactNode } from 'react';
import { Metadata } from 'next';

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
            {children}
        </>
    );
}