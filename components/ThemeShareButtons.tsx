"use client";

import { Moon, Sun, Share } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeShareButtons() {
    const [isDark, setIsDark] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    useEffect(() => {
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
            <div className="absolute top-6 right-6 flex gap-3 z-10">
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                    className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button
                    onClick={handleShare}
                    aria-label="Share Profile"
                    className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
