'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sidebar } from './Sidebar';
import { ColorPaletteSelector } from './ColorPaletteSelector';
import { cn } from '@/lib/utils';
import { Menu, X, Palette } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { isSidebarCollapsed, toggleSidebar, isMobile } = useTheme();
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const paletteRef = useRef<HTMLDivElement>(null);

    // Close palette selector when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
                setIsPaletteOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
                        >
                            {isSidebarCollapsed ? (
                                <Menu className="w-5 h-5 text-[var(--color-text)]" />
                            ) : (
                                <X className="w-5 h-5 text-[var(--color-text)]" />
                            )}
                        </button>
                        <h2 className="text-xl font-semibold text-[var(--color-text)]">
                            Welcome to Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Palette Selector */}
                        <div className="relative" ref={paletteRef}>
                            <button
                                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                                className={cn(
                                    'p-2 rounded-lg transition-all duration-200 hover:scale-105',
                                    'hover:bg-[var(--color-surface)] border border-transparent',
                                    isPaletteOpen
                                        ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--color-primary)]'
                                        : 'text-[var(--color-text)] hover:text-[var(--color-primary)]'
                                )}
                                title="Choose Color Theme"
                            >
                                <Palette className="w-5 h-5" />
                            </button>

                            {/* Color Palette Dropdown */}
                            {isPaletteOpen && (
                                <div className={cn(
                                    'absolute right-0 top-full mt-2 z-50',
                                    'bg-[var(--color-surface)] border border-[var(--color-border)]',
                                    'rounded-xl shadow-2xl backdrop-blur-sm',
                                    'p-4 min-w-[280px]',
                                    'animate-in slide-in-from-top-2 duration-200'
                                )}>
                                    <ColorPaletteSelector />
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobile && !isSidebarCollapsed && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}
