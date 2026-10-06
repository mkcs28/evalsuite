import type { Metadata } from "next";
import { UnsubscribeForm } from "@/components/download/unsubscribe-form";

export const metadata: Metadata = {
  title: "Stop security notices",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function UnsubscribePage() {
  return <UnsubscribeForm />;
}
