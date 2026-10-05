import { Archivo } from "next/font/google";

// next/font only accepts literal options, so these mirror theme.font in tokens.ts.
export const bodyFont = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
});
