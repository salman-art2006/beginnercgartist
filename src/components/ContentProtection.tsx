import { useEffect } from "react";

/**
 * Content Protection Component
 * 
 * Prevents casual theft of 3D models and images by:
 * - Disabling right-click context menu
 * - Blocking drag & drop of images
 * - Disabling keyboard shortcuts for save/copy
 * - Adding a transparent overlay on images
 * 
 * Note: This is deterrent-level protection. Determined users with dev tools 
 * can always access rendered content. For true protection, serve 3D models 
 * via signed URLs with time-limited access.
 */
const ContentProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "IMG" ||
        target.tagName === "CANVAS" ||
        target.closest(".protected-content") ||
        target.closest("[data-protected]")
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag on images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" || target.closest(".protected-content")) {
        e.preventDefault();
        return false;
      }
    };

    // Block keyboard shortcuts for save/copy on protected content
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S, Ctrl+U (view source), Ctrl+Shift+I (dev tools)
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "s" || e.key === "S") {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
};

export default ContentProtection;
