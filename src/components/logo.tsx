import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <>
      <Image
        src="/logo-light.png"
        alt="Solaire"
        width={size}
        height={size}
        className={cn("object-contain dark:hidden", className)}
        priority
      />
      <Image
        src="/logo-dark.png"
        alt="Solaire"
        width={size}
        height={size}
        className={cn("object-contain hidden dark:block", className)}
        priority
      />
    </>
  );
}
