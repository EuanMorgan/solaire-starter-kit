import { env } from "@/env";

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  links: {
    github: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Solaire",
  description: "A modern Next.js starter with authentication, tRPC, and more",
  url: env.NEXT_PUBLIC_BASE_URL,
  links: {
    github: "https://github.com/yourusername/solaire",
  },
};
