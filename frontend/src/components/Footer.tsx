import { siteConfig } from "../config/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4">
        <div className="flex flex-wrap justify-center gap-4">
          <a href={`mailto:${siteConfig.email}`} className="hover:text-slate-950 dark:hover:text-white">
            Email
          </a>
          <a href={`tel:${siteConfig.phone}`} className="hover:text-slate-950 dark:hover:text-white">
            Call
          </a>
          <a
            href={siteConfig.social.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-950 dark:hover:text-white"
          >
            WhatsApp
          </a>
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-950 dark:hover:text-white"
          >
            GitHub
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-950 dark:hover:text-white"
          >
            LinkedIn
          </a>
        </div>
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
