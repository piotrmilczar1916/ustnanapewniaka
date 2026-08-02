import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg" | "sm";

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-stamp-red text-paper border-ink hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
  secondary:
    "bg-paper text-ink border-ink hover:bg-paper-dim hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
  ghost:
    "bg-transparent text-ink border-transparent shadow-none hover:bg-paper-dim",
};

const sizeClasses: Record<Size, string> = {
  sm: "min-h-10 px-3 py-2 text-sm",
  md: "min-h-11 px-4 py-2.5 text-sm sm:text-base",
  lg: "min-h-12 px-5 py-3 text-base sm:text-lg",
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={[
        "inline-flex items-center justify-center gap-2 border-2 font-display font-bold uppercase tracking-wide",
        "shadow-[4px_4px_0_var(--ink)] transition-[transform,box-shadow,background-color] duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stamp-red",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Link>
  );
}
