import { useQuery } from "@tanstack/react-query";
import { sb } from "@/lib/db";

export interface ContactSettings {
  email: string;
  youtube: string;
  instagram: string;
  artstation: string;
  gumroad: string;
}

export const DEFAULT_CONTACT: ContactSettings = {
  email: "",
  youtube: "https://www.youtube.com/@BeginnerCGArtist",
  instagram: "https://www.instagram.com/beginnercg_artist/",
  artstation: "https://www.artstation.com/beginnercgartist",
  gumroad: "https://beginnercgartist.gumroad.com/",
};

export const siteSettingsService = {
  async getContact(): Promise<ContactSettings> {
    const { data } = await sb.from("site_settings").select("value").eq("key", "contact").maybeSingle();
    return { ...DEFAULT_CONTACT, ...((data?.value as Partial<ContactSettings>) ?? {}) };
  },

  async saveContact(value: ContactSettings): Promise<void> {
    const { error } = await sb.from("site_settings").upsert({ key: "contact", value });
    if (error) throw new Error(error.message);
  },
};

export const useContactSettings = () =>
  useQuery({ queryKey: ["site-contact"], queryFn: () => siteSettingsService.getContact(), staleTime: 5 * 60 * 1000 });
