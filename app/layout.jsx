import "./globals.css";
import { AuthProvider } from "./Providers";

export const metadata = {
  title: "App de Promociones",
  description: "Panel de gestión",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}