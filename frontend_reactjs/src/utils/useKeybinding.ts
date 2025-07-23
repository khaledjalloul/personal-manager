import { useEffect } from "react";

export const useKeybinding = (key: string, fn: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === key) {
        event.preventDefault();
        fn();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fn]);
}

export const useCtrlS = (fn: () => void) => {
  useKeybinding("s", fn);
}
