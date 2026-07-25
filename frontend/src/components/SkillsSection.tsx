import { siteConfig } from "../config/site";

export default function SkillsSection() {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {siteConfig.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
