import { Github } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function PublicFooter() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">Made with ❤️ in Wales 🏴󠁧󠁢󠁷󠁬󠁳󠁿</p>
        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
        >
          <Github className="size-5" />
          <span className="sr-only">GitHub</span>
        </Link>
      </div>
    </footer>
  );
}
