import "@/app/globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Global styles, fonts, providers */}
        {children}
      </body>
    </html>
  );
}