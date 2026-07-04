import { AnimatePresence, motion } from "framer-motion";
import { slideUp } from "../../lib/motion";

// Route/tab-level transition wrapper. `id` should be a value that changes
// when the "page" changes (e.g. the active tab name or route pathname) so
// AnimatePresence knows to run the exit/enter transition.
export default function PageTransition({ id, className, children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        variants={slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
