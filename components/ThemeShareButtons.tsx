"use client";

import { Moon, Sun, Share } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeShareButtons() {
    const [isDark, setIsDark] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.remove("dark");
            localStorage.theme = "light";
            setIsDark(false);
        } else {
            root.classList.add("dark");
            localStorage.theme = "dark";
            setIsDark(true);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: "Profil Pribadi",
            text: "Lihat portofolio dan tautan profesional saya!",
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setToastMsg("Tautan berhasil disalin ke clipboard!");
                setTimeout(() => setToastMsg(""), 3000);
            } catch (err) {
                setToastMsg("Gagal menyalin tautan.");
                setTimeout(() => setToastMsg(""), 3000);
            }
        }
    };

    return (
        <>
            <div className="fixed top-4 right-4 md:top-6 md:right-6 flex items-center gap-1 p-1 z-50 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm">
                {mounted && (
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                )}

                <button
                    onClick={handleShare}
                    aria-label="Share Profile"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Share className="w-5 h-5" />
                </button>
            </div>

            <div
                className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-500 pointer-events-none ${toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
            >
                {toastMsg}
            </div>
        </>
    );
}
