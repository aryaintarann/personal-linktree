import Image from "next/image";
import ThemeShareButtons from "@/components/ThemeShareButtons";
import GsapWrapper from "@/components/GsapWrapper";
import LinkCard from "@/components/LinkCard";
import { createClient } from "@/lib/supabase/server";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Github,
  Link2,
  Linkedin,
  MessageCircle,
  Music2,
  MessageSquare,
  Send,
  Twitch,
  Dribbble,
  Figma,
  Gitlab,
  Slack,
  BookOpen
} from "lucide-react";

export const revalidate = 60; // revalidate every 60s

async function getProfileData() {
  try {
    const supabase = await createClient();

    // For demo purposes, we fetch the first profile.
    // We add a 15 second timeout in case the Supabase free tier database is sleeping or the server internet is slow
    const profilePromise = supabase.from('profiles').select('*').limit(1).single();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Database connection timeout")), 15000));
    const { data: profile } = (await Promise.race([profilePromise, timeoutPromise])) as any;

    if (!profile) {
      throw new Error("No profile found - reverting to mock data");
    }

    const { data: links } = await supabase.from('links').select('*').eq('user_id', profile.id).order('order_index', { ascending: true });
    const { data: socials } = await supabase.from('socials').select('*').eq('user_id', profile.id).order('order_index', { ascending: true });

    return { profile, links: links || [], socials: socials || [] };
  } catch (e) {
    // Graceful fallback to Mock Data if DB isn't connected yet (match index.html)
    return {
      profile: {
        full_name: "Budi Santoso",
        bio: "Desainer Produk & Pengembang Web. Membantu bisnis tumbuh melalui desain digital yang luar biasa.",
        avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
      },
      links: [
        { id: "1", title: "Portofolio Pribadi", subtitle: "Lihat hasil karya terbaru saya", url: "#", icon_name: "Briefcase" },
        { id: "2", title: "LinkedIn", subtitle: "Mari terhubung secara profesional", url: "#", icon_name: "Linkedin", icon_color: "#0077b5" },
        { id: "3", title: "GitHub", subtitle: "Kode dan proyek open source", url: "#", icon_name: "Github" },
        { id: "4", title: "Hubungi Saya", subtitle: "Konsultasi via WhatsApp", url: "#", icon_name: "MessageCircle", icon_color: "#22c55e" }
      ],
      socials: [
        { id: "1", platform: "Instagram", url: "#" },
        { id: "2", platform: "Twitter", url: "#" },
        { id: "3", platform: "Facebook", url: "#" },
        { id: "4", platform: "Youtube", url: "#" }
      ]
    };
  }
}

const SocialIconComponent = ({ platform, url }: { platform: string, url: string }) => {
  const p = platform.toLowerCase();
  const baseClasses = "text-gray-400 transition-colors transform hover:scale-110";

  if (p.includes('instagram')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-pink-500 dark:hover:text-pink-400`} aria-label={platform}><Instagram className="w-6 h-6" /></a>;
  if (p.includes('twitter') || p.includes('x.com')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-blue-400`} aria-label={platform}><Twitter className="w-6 h-6" /></a>;
  if (p.includes('facebook')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-blue-600`} aria-label={platform}><Facebook className="w-6 h-6" /></a>;
  if (p.includes('youtube')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-red-500`} aria-label={platform}><Youtube className="w-6 h-6" /></a>;
  if (p.includes('github')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-gray-900 dark:hover:text-white`} aria-label={platform}><Github className="w-6 h-6" /></a>;
  if (p.includes('linkedin')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-blue-700 dark:hover:text-blue-500`} aria-label={platform}><Linkedin className="w-6 h-6" /></a>;
  if (p.includes('whatsapp')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-green-500`} aria-label={platform}><MessageCircle className="w-6 h-6" /></a>;
  if (p.includes('tiktok')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-black dark:hover:text-white`} aria-label={platform}><Music2 className="w-6 h-6" /></a>;
  if (p.includes('discord')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-[#5865F2]`} aria-label={platform}><MessageSquare className="w-6 h-6" /></a>;
  if (p.includes('telegram')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-[#0088cc]`} aria-label={platform}><Send className="w-6 h-6" /></a>;
  if (p.includes('twitch')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-[#9146FF]`} aria-label={platform}><Twitch className="w-6 h-6" /></a>;
  if (p.includes('dribbble')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-[#ea4c89]`} aria-label={platform}><Dribbble className="w-6 h-6" /></a>;
  if (p.includes('figma')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-[#F24E1E]`} aria-label={platform}><Figma className="w-6 h-6" /></a>;
  if (p.includes('gitlab')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-[#FCA121]`} aria-label={platform}><Gitlab className="w-6 h-6" /></a>;
  if (p.includes('slack')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-[#E01E5A]`} aria-label={platform}><Slack className="w-6 h-6" /></a>;
  if (p.includes('medium')) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-black dark:hover:text-white`} aria-label={platform}><BookOpen className="w-6 h-6" /></a>;

  return <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} hover:text-gray-600 dark:hover:text-gray-300`} aria-label={platform}><Link2 className="w-6 h-6" /></a>;
};

export default async function Home() {
  const { profile, links, socials } = await getProfileData();
  const currentYear = new Date().getFullYear();

  return (
    <main className="w-full max-w-md mx-auto px-6 py-12 relative flex flex-col items-center min-h-screen">
      <GsapWrapper>
        <ThemeShareButtons />

        {/* Profile Header */}
        <header className="animate-header flex flex-col items-center mb-10 w-full mt-8">
          <div className="relative w-28 h-28 mb-4">
            <Image
              src={profile.avatar_url || "https://via.placeholder.com/150?text=Profil"}
              alt="Foto Profil"
              width={112}
              height={112}
              className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
              priority
              unoptimized
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full shadow-inner animate-pulse"></span>
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            {profile.full_name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-[280px] leading-relaxed">
            {profile.bio}
          </p>
        </header>

        {/* Link List */}
        <div className="w-full flex flex-col gap-4 mb-10">
          {links.map((link: any) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>

        {/* Social Icons */}
        <div className="animate-bottom flex gap-6 mb-12">
          {socials.map((social: any) => (
            <SocialIconComponent key={social.id} platform={social.platform} url={social.url} />
          ))}
        </div>

        {/* Footer */}
        <footer className="animate-bottom mt-auto pb-4 text-center text-xs text-gray-400">
          <p>
            &copy; {currentYear} {profile.full_name}.
          </p>
        </footer>
      </GsapWrapper>
    </main>
  );
}
