"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    useEffect(() => {
        async function checkToken() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await fetch('/api/verify-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
                if (!response.ok) {
                    throw new Error('Token verification failed');
                }
                const data = await response.json();
                if (data.status === 'error') {
                    throw new Error(data.message);
                }
                router.push('/dashboard');
            } catch (error) {
                console.log(error)
            }
        }
        checkToken();
    }, []);
    return (
        <>
            {children}
        </>
    );
}