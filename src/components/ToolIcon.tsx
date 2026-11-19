import { Aperture, Cloud, Network, type LucideIcon } from "lucide-react";

export interface Tool {
  name: string;
  mask?: string;
  color?: string;
  icon?: LucideIcon;
}

// Logos: Simple Icons (CC0). Cycles, Geometry Nodes and OctaSpace have no logo there, so they get plain icons.
export const TOOLS: Tool[] = [
  { name: "Blender 5.2", mask: "/tools/blender.svg", color: "#E87D0D" },
  { name: "Cycles", icon: Aperture },
  { name: "Geometry Nodes", icon: Network },
  { name: "DaVinci Resolve Studio", mask: "/tools/davinciresolve.svg" },
  { name: "Photopea", mask: "/tools/photopea.svg", color: "#18A497" },
  { name: "OctaSpace cloud rendering", icon: Cloud },
];

export const ToolIcon = ({ tool, className = "h-5 w-5" }: { tool: Tool; className?: string }) => {
  if (tool.mask) {
    const m = `url(${tool.mask}) center / contain no-repeat`;
    return <span aria-hidden="true" className={`inline-block shrink-0 ${className}`} style={{ backgroundColor: tool.color || "currentColor", WebkitMask: m, mask: m }} />;
  }
  const Icon = tool.icon!;
  return <Icon aria-hidden="true" className={`shrink-0 ${className}`} />;
};
