import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/password-forms";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
  // Do not leak the page URL to other origins.
  referrer: "no-referrer",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
