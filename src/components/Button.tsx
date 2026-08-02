import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  href?: never;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-stamp-red text-paper border-ink hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
  secondary:
    "bg-paper text-ink border-ink hover:bg-paper-dim hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
  ghost:
    "bg-transparent text-ink border-transparent shadow-none hover:bg-paper-dim",
  danger:
    "bg-ink text-paper border-ink hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
};

const sizeClasses: Record<Size, string> = {
  sm: "min-h-10 px-3 py-2 text-sm",
  md: "min-h-11 px-4 py-2.5 text-sm sm:text-base",
  lg: "min-h-12 px-5 py-3 text-base sm:text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 border-2 font-display font-bold uppercase tracking-wide",
        "shadow-[4px_4px_0_var(--ink)] transition-[transform,box-shadow,background-color] duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stamp-red",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_var(--ink)]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
