import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    const { data: links } = await supabase.from("links").select("*").eq("user_id", user.id).order("order_index", { ascending: true });
    const { data: socials } = await supabase.from("socials").select("*").eq("user_id", user.id).order("order_index", { ascending: true });

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Selamat Datang!</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Kelola halaman linktree publik Anda dari dashboard ini.</p>

            <DashboardClient
                initialProfile={profile || {}}
                initialLinks={links || []}
                initialSocials={socials || []}
            />
        </div>
    );
}
