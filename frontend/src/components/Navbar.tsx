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
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <NavLink to="/" className="text-lg font-semibold">
          {siteConfig.name}
        </NavLink>
        <div className="flex items-center gap-6">
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
          <DarkModeToggle />
        </div>
      </nav>
    </header>
  );
}
