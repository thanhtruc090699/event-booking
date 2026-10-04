"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type TimerBannerProps = {
    label: string;
    time?: string;  // For backward compatibility
    expiresAt?: string;  // ISO date string
    note?: string;
    danger?: boolean;
    onExpire?: () => void;  // Callback when timer expires
};

export function TimerBanner({
    label,
    time,
    expiresAt,
    note,
    danger = false,
    onExpire,
}: TimerBannerProps) {
    const [timeLeft, setTimeLeft] = useState<string>("00:00");
    
    useEffect(() => {
        if (!expiresAt) {
            return;
        }
        
        function updateTimer() {
            const expiryTime = new Date(expiresAt!).getTime();
            const now = Date.now();
            const diff = expiryTime - now;
            
            if (diff <= 0) {
                setTimeLeft("00:00");
                onExpire?.();
                return;
            }
            
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeLeft(
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }
        
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        
        return () => clearInterval(interval);
    }, [expiresAt, time, onExpire]);
    
    return (
        <div
            className={cn(
                "mb-[18px] rounded-xl border p-4",
                danger
                    ? "border-[var(--crimson)] bg-[rgba(255,61,87,0.08)]"
                    : "border-[var(--gold)] bg-[rgba(245,184,65,0.08)]"
            )}
        >
            <div className="text-xs text-[var(--muted)]">
                {label}
            </div>

            <div
                className={cn(
                    "my-1 font-[var(--font-mono)] text-[28px] font-bold",
                    danger ? "text-[var(--crimson)]" : "text-[var(--gold)]"
                )}
            >
                {timeLeft}
            </div>

            {note && (
                <div className="text-xs text-[var(--muted)]">
                    {note}
                </div>
            )}
        </div>
    );
}
