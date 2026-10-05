import type { ReactNode } from "react";
import "./globals.css";

// Scaffold only; replaced by the (default) and (alternate) root layouts in the routing commit.
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
