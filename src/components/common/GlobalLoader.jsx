import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Commet } from 'react-loading-indicators';
import { subscribeToLoading } from '../../api/client';

export default function GlobalLoader() {
    const [apiLoading, setApiLoading] = useState(false);
    const [navLoading, setNavLoading] = useState(false);
    const location = useLocation();

    // Subscribe to API data fetching state
    useEffect(() => {
        const unsubscribe = subscribeToLoading((isLoading) => {
            setApiLoading(isLoading);
        });
        return () => unsubscribe();
    }, []);

    // Trigger loading on route navigation
    useEffect(() => {
        setNavLoading(true);
        const timer = setTimeout(() => {
            setNavLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [location.pathname, location.search]);

    const showLoader = apiLoading || navLoading;

    if (!showLoader) return null;

    return (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm transition-all duration-300 pointer-events-auto">
            <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/90 shadow-2xl border border-slate-100/80">
                <Commet color="#3151cc" size="large" text="Kuting..." textColor="" />
            </div>
        </div>
    );
}
