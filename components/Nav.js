"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/patrinove", label: "Patrinove" },
  { href: "/soins-intimes", label: "Soins intimes" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      <Link href="/" className="mark" aria-label="Odune, accueil">
        <Logo height={17} />
      </Link>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} data-on={path === l.href ? "1" : "0"}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
