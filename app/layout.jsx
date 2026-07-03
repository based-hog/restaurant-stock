import "./globals.css";

export const metadata = {
  title: "Хинкальня Склад",
  description: "Учет прихода и списания",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2ecc71" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body>{children}</body>
    </html>
  );
}