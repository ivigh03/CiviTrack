import { motion } from "framer-motion";
import * as variants from "../../lib/motion";

// Generic fade/slide/scale wrapper — pass a `variant` name from lib/motion.js
// instead of re-declaring the same animation object in every component.
export default function AnimatedContainer({
  variant = "fadeIn",
  as = "div",
  className,
  delay = 0,
  children,
  ...props
}) {
  const MotionTag = motion[as] || motion.div;
  const selected = variants[variant] || variants.fadeIn;

  return (
    <MotionTag
      variants={selected}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={delay ? { delay } : undefined}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerList({ className, staggerChildren = 0.05, children, ...props }) {
  return (
    <motion.div
      variants={variants.staggerContainer(staggerChildren)}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ className, children, ...props }) {
  return (
    <motion.div variants={variants.staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}
