import { useEffect } from "react";

export const useKeybinding = (key: string, fn: () => void, with_ctrl: boolean = true) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (with_ctrl ? event.ctrlKey && event.key === key : event.key === key) {
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
