import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-card",
  secondary:
    "bg-elevated text-foreground border border-border hover:bg-elevated/70",
  ghost: "bg-transparent text-foreground hover:bg-elevated/60",
  danger: "bg-danger text-white hover:bg-danger/90",
  outline: "bg-transparent border border-border text-foreground hover:bg-elevated/50",
};

const SIZES = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10 p-0",
};

const Button = forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      children,
      onClick,
      type = "button",
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState([]);

    const handleClick = (e) => {
      if (disabled || loading) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now();
      const size = Math.max(rect.width, rect.height) * 2;
      setRipples((prev) => [
        ...prev,
        {
          id,
          x: e.clientX - rect.left - size / 2,
          y: e.clientY - rect.top - size / 2,
          size,
        },
      ]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={disabled || loading ? undefined : { scale: 1.02 }}
        whileTap={disabled || loading ? undefined : { scale: 0.97 }}
        disabled={disabled || loading}
        onClick={handleClick}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-xl font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-white/30 animate-[ping_0.6s_ease-out]"
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
            }}
          />
        ))}

        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
