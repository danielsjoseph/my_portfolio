import { siteConfig } from "../config/site";

export default function ContactSection() {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">Get in touch</h2>
      <p className="mb-4 text-slate-600 dark:text-slate-400">
        Have a role, project, or question in mind? I'd like to hear from you.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={`mailto:${siteConfig.email}`}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Email me
        </a>
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          GitHub
        </a>
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
