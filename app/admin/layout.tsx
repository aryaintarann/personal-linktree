import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row font-sans">
            {/* Sidebar for Desktop / Topbar for Mobile */}
            {user && (
                <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                    </nav>

                    <form action="/auth/signout" method="post" className="mt-auto pt-6">
                        <button className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Keluar
                        </button>
                    </form>
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-auto">
                {children}
            </main>
        </div>
    );
}
