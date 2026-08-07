import { NavLink } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { siteConfig } from "../config/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3">
        <NavLink to="/" className="text-base font-semibold whitespace-nowrap sm:text-lg">
          {siteConfig.name}
        </NavLink>
        <div className="flex items-center gap-3 sm:gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-slate-950 dark:hover:text-white ${
                  isActive ? "text-slate-950 dark:text-white" : "text-slate-500 dark:text-slate-400"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${siteConfig.phone}`}
              title="Call me"
              aria-label="Call me"
              className="text-base text-slate-500 transition hover:text-slate-950 sm:text-lg dark:text-slate-400 dark:hover:text-white"
            >
              📞
            </a>
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noreferrer"
              title="WhatsApp"
              aria-label="WhatsApp"
              className="text-base text-slate-500 transition hover:text-slate-950 sm:text-lg dark:text-slate-400 dark:hover:text-white"
            >
              💬
            </a>
          </div>
          <DarkModeToggle />
        </div>
      </nav>
    </header>
  );
}
