/**
 * Subscriber Service — now backed by Supabase edge function + database.
 */

import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const subscribeSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Enter a valid email").max(255, "Email too long"),
});

export interface SubscriberData {
  name: string;
  email: string;
  token: string;
  subscribedAt: string;
}

interface SubscribeResult {
  success: boolean;
  data?: SubscriberData;
  error?: string;
}

interface DownloadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const subscriberService = {
  async subscribe(input: { name: string; email: string }): Promise<SubscribeResult> {
    const parsed = subscribeSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    try {
      const { data, error } = await supabase.functions.invoke("subscribe", {
        body: parsed.data,
      });

      if (error) {
        return { success: false, error: error.message || "Subscription failed" };
      }

      if (data?.error) {
        return { success: false, error: data.error };
      }

      if (data?.success && data?.data) {
        return { success: true, data: data.data };
      }

      return { success: false, error: "Unexpected response" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, error: msg };
    }
  },

  /**
   * Request a download URL for a protected file.
   * In production, add a dedicated edge function that validates the token
   * and returns a signed storage URL.
   */
  async requestDownload(fileId: string, token: string): Promise<DownloadResult> {
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    // For now, simulate the download with the token validation
    // In production: call an edge function that validates token and returns signed URL
    return {
      success: true,
      url: `#download-${fileId}`,
    };
  },
};
