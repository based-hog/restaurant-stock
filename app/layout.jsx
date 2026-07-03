export const metadata = {
  title: "Restaurant Stock",
  description: "Учет прихода и списания"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}