import { Gift } from "lucide-react";
import { useSubscribeModal } from "@/contexts/SubscribeModalContext";
import { useSubscriber } from "@/contexts/SubscriberContext";

interface JoinButtonProps {
  /** "brand" = yellow, "light" = white (for use over photos), "outline" = quiet. */
  variant?: "brand" | "light" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizes = { sm: "h-9 px-4 text-sm", md: "px-6 py-3.5 text-base", lg: "px-8 py-4 text-base" };
const variants = {
  brand: "bg-brand text-brand-foreground hover:opacity-90",
  light: "bg-white text-[#141414] hover:bg-white/90",
  outline: "border border-foreground/30 text-foreground hover:bg-secondary",
};

/** Highlighted call to action that opens the "Join the list" popup. Hidden once subscribed. */
const JoinButton = ({ variant = "brand", size = "md", className = "", label = "Join the list" }: JoinButtonProps) => {
  const { open } = useSubscribeModal();
  const { isSubscribed } = useSubscriber();
  if (isSubscribed) return null;
  return (
    <button
      type="button"
      onClick={open}
      className={`relative inline-flex items-center justify-center gap-2 rounded-md font-body font-bold transition-all ${sizes[size]} ${variants[variant]} ${className}`}
    >
      <Gift className="h-4 w-4" />
      {label}
      <span className="absolute -right-1 -top-1 flex h-3 w-3" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFD23F] opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#FFD23F] ring-2 ring-background" />
      </span>
    </button>
  );
};

export default JoinButton;
