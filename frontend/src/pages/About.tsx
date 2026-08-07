import { useEffect, useState } from "react";
import SkillsSection from "../components/SkillsSection";
import { fetchProfile } from "../api/projects";
import { siteConfig } from "../config/site";

export default function About() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(siteConfig.resumeUrl);
  const [showResume, setShowResume] = useState(true);

  useEffect(() => {
    fetchProfile()
      .then((profile) => {
        if (profile.resume_url) setResumeUrl(profile.resume_url);
      })
      .catch(() => {});
  }, []);

  const isViewablePdf = !!resumeUrl && resumeUrl.split("?")[0].toLowerCase().endsWith(".pdf");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">About</h1>

      <div className="mt-6 whitespace-pre-line text-slate-700 dark:text-slate-300">{siteConfig.bio}</div>

      {resumeUrl && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {isViewablePdf && (
            <button
              type="button"
              onClick={() => setShowResume((v) => !v)}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {showResume ? "Hide resume" : "View resume"}
            </button>
          )}
          <a
            href={resumeUrl}
            download
            className={
              isViewablePdf
                ? "text-sm text-slate-500 underline hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                : "rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            }
          >
            {isViewablePdf ? "Download PDF" : "Download resume"}
          </a>
        </div>
      )}

      {isViewablePdf && showResume && (
        <iframe
          src={resumeUrl!}
          title="Resume"
          className="mt-6 h-[80vh] w-full rounded-lg border border-slate-200 dark:border-slate-800"
        />
      )}

      <div className="mt-10">
        <SkillsSection />
      </div>
    </div>
  );
}
