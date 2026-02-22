"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Save } from "lucide-react";

export default function DashboardClient({
    initialProfile,
    initialLinks,
    initialSocials
}: {
    initialProfile: any;
    initialLinks: any[];
    initialSocials: any[]
}) {
    const [profile, setProfile] = useState(initialProfile || { full_name: "", bio: "", avatar_url: "" });
    const [links, setLinks] = useState(initialLinks || []);
    const [socials, setSocials] = useState(initialSocials || []);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const handleProfileChange = (e: any) => setProfile({ ...profile, [e.target.name]: e.target.value });

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            setUploadingAvatar(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Please log in to upload avatar");

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setProfile({ ...profile, avatar_url: publicUrl });
            alert("Foto profil berhasil diunggah!");
        } catch (error: any) {
            alert("Error saat mengunggah foto: " + error.message);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleLinkChange = (id: string, field: string, value: string) => setLinks(links.map(l => (l.id === id ? { ...l, [field]: value } : l)));
    const addLink = () => setLinks([...links, { id: "temp-l-" + Date.now(), title: "Karya Baru", url: "https://", icon_name: "Link2", order_index: links.length, isNew: true }]);
    const removeLink = async (id: string) => {
        if (!id.startsWith("temp-")) await supabase.from("links").delete().eq("id", id);
        setLinks(links.filter(l => l.id !== id));
    };

    const handleSocialChange = (id: string, field: string, value: string) => setSocials(socials.map(s => (s.id === id ? { ...s, [field]: value } : s)));
    const addSocial = () => setSocials([...socials, { id: "temp-s-" + Date.now(), platform: "Instagram", url: "https://", order_index: socials.length, isNew: true }]);
    const removeSocial = async (id: string) => {
        if (!id.startsWith("temp-")) await supabase.from("socials").delete().eq("id", id);
        setSocials(socials.filter(s => s.id !== id));
    };

    const saveChanges = async () => {
        setSaving(true);
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (!user) throw new Error("Not Logged in");

            // Profile
            if (profile.id) {
                await supabase.from("profiles").update({ full_name: profile.full_name, bio: profile.bio, avatar_url: profile.avatar_url }).eq("id", profile.id);
            } else {
                await supabase.from("profiles").insert({ id: user.id, ...profile });
            }

            // Links
            for (const link of links) {
                if (link.isNew) await supabase.from("links").insert({ user_id: user.id, title: link.title, url: link.url, icon_name: link.icon_name, icon_color: link.icon_color, order_index: link.order_index });
                else await supabase.from("links").update({ title: link.title, url: link.url, icon_name: link.icon_name, icon_color: link.icon_color, order_index: link.order_index }).eq("id", link.id);
            }

            // Socials
            for (const social of socials) {
                if (social.isNew) await supabase.from("socials").insert({ user_id: user.id, platform: social.platform, url: social.url, order_index: social.order_index });
                else await supabase.from("socials").update({ platform: social.platform, url: social.url, order_index: social.order_index }).eq("id", social.id);
            }

            alert("Perubahan berhasil disimpan!");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8 pb-10">
            <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Profil Utama</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                        <input type="text" name="full_name" value={profile.full_name} onChange={handleProfileChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio Pekerjaan</label>
                        <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows={3} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unggah Foto Profil</label>
                        <div className="flex items-center gap-4">
                            {profile.avatar_url && (
                                <img src={profile.avatar_url} alt="Profile preview" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={uploadingAvatar}
                                className="w-full p-2 flex-col justify-center border border-dashed border-gray-300 dark:border-gray-600 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-0 file:py-1 file:px-3 file:rounded-full file:text-xs file:font-semibold rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        {uploadingAvatar && <p className="text-xs text-blue-500 mt-2">Sedang mengunggah gambar...</p>}
                    </div>
                </div>
            </section>

            <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Tautan Portofolio</h2>
                    <button onClick={addLink} className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                        <Plus className="w-4 h-4" /> Tambah Tautan
                    </button>
                </div>

                <div className="space-y-4">
                    {links.map((link, index) => (
                        <div key={link.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 relative group">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Judul Tautan</label>
                                    <input type="text" value={link.title} onChange={e => handleLinkChange(link.id, "title", e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">URL Tujuan</label>
                                    <input type="text" value={link.url} onChange={e => handleLinkChange(link.id, "url", e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Nama Ikon (Lucide)</label>
                                    <input type="text" value={link.icon_name || ""} placeholder="Contoh: Github, Youtube" onChange={e => handleLinkChange(link.id, "icon_name", e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Warna Ikon (Hex) Opsional</label>
                                    <input type="text" value={link.icon_color || ""} placeholder="#ff0000" onChange={e => handleLinkChange(link.id, "icon_color", e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" />
                                </div>
                            </div>
                            <button onClick={() => removeLink(link.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {links.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Belum ada tautan. Tambahkan satu!</p>}
                </div>
            </section>

            <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Media Sosial</h2>
                    <button onClick={addSocial} className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                        <Plus className="w-4 h-4" /> Tambah Sosmed
                    </button>
                </div>

                <div className="space-y-4">
                    {socials.map((social, index) => (
                        <div key={social.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center gap-4">
                            <div className="flex-1">
                                <input type="text" value={social.platform} placeholder="Platform (eg: Instagram)" onChange={e => handleSocialChange(social.id, "platform", e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white mb-2" />
                                <input type="text" value={social.url} placeholder="https://instagram.com/..." onChange={e => handleSocialChange(social.id, "url", e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" />
                            </div>
                            <button onClick={() => removeSocial(social.id)} className="text-red-400 hover:text-red-600 p-2">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {socials.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Belum ada sosmed yang ditampilkan.</p>}
                </div>
            </section>

            <button
                onClick={saveChanges}
                disabled={saving}
                className="fixed bottom-8 right-8 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 hover:shadow-xl transition-all disabled:opacity-50"
            >
                <Save className="w-5 h-5" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

        </div>
    );
}
