import * as LucideIcons from "lucide-react";
import { ChevronRight } from "lucide-react";

interface LinkItem {
    id: string;
    title: string;
    url: string;
    icon_name?: string;
    icon_color?: string;
    subtitle?: string;
}

export default function LinkCard({ link }: { link: LinkItem }) {
    const IconComponent = link.icon_name && (LucideIcons as any)[link.icon_name]
        ? (LucideIcons as any)[link.icon_name]
        : LucideIcons.Link2;
    const getIconStyles = () => {
        if (link.icon_color) {
            return { color: link.icon_color, backgroundColor: `${link.icon_color}20` };
        }
        return {};
    };

    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-card-anim group flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="flex items-center gap-4">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                    style={link.icon_color ? getIconStyles() : {}}
                    {...(!link.icon_color && { className: "w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110" })}
                >
                    <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {link.title}
                    </span>
                    {link.subtitle && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {link.subtitle}
                        </span>
                    )}
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors" />
        </a>
    );
}
