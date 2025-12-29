import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    // Email + Password authentication
    Password,
    // Email OTP via Resend (optional - requires AUTH_RESEND_KEY)
    Resend({
      from: process.env.AUTH_RESEND_FROM ?? "Interior AI <noreply@example.com>",
    }),
    // OAuth providers (optional - require respective API keys)
    GitHub,
    Google,
  ],
});
