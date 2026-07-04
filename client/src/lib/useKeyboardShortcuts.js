import { useEffect } from "react";

// Registers a global keydown listener for `Ctrl/Cmd+<key>` combos.
// `shortcuts` is a map of lowercase key -> handler, e.g. { k: openPalette }.
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handler = (e) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;

      const key = e.key.toLowerCase();
      const fn = shortcuts[key];
      if (fn) {
        e.preventDefault();
        fn(e);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
