import { siteConfig } from "../config/site";

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-5xl">
        <a
          href={`tel:${siteConfig.phone}`}
          className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <span className="text-lg">📞</span> Call me
        </a>
        <div className="w-px bg-slate-200 dark:bg-slate-800" />
        <a
          href={siteConfig.social.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <span className="text-lg">💬</span> WhatsApp
        </a>
      </div>
    </nav>
  );
}
