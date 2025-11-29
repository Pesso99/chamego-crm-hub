import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function Logo({ size = "md", className, showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "font-serif font-bold bg-gradient-to-r from-chamego-rosa to-chamego-dourado bg-clip-text text-transparent",
          sizeClasses[size]
        )}
      >
        Chamego
      </div>
      {showText && (
        <span className="text-xs text-muted-foreground font-sans uppercase tracking-wider">
          CRM
        </span>
      )}
    </div>
  );
}
