import "./globals.css";

export const metadata = {
  title: "Avarabrands — Asset Infrastructure",
  description: "Digital Asset Passports for commercial real estate and heavy industrial equipment transactions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
