import Image from "next/image";
import Link from "next/link";
import { FOOTER_COLUMNS } from "@/lib/navigation";
import { NewsletterForm } from "./newsletter-form";

// The footer stays dark in both modes, as in the design.
export function Footer() {
  return (
    <footer
      data-theme="dark"
      className="flex w-full flex-col gap-16 border-t border-border bg-bg px-4 pt-16 pb-8 text-text lg:px-[var(--page-margin)]"
    >
      <div className="flex flex-wrap gap-x-8 gap-y-12">
        <NewsletterForm />
        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-[1_1_140px] flex-col gap-3 text-body-s">
            <span className="text-micro font-medium text-muted uppercase">{column.title}</span>
            {column.links.map((link) => (
              <Link key={link.label} href={link.href} className="text-text">
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <Image src="/brand/shadoz-monogram.png" alt="Shadoz monogram" width={37} height={40} className="block h-10 w-auto" />
        <span className="text-micro font-medium text-muted uppercase">Cut and sewn in Sri Lanka</span>
        <span className="text-micro font-medium text-muted uppercase">© 2026 Shadoz · LKR</span>
      </div>
    </footer>
  );
}
