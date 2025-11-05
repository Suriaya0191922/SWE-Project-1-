// app/layout.js
import "./globals.css";

export const metadata = {
  title: "ThriftVault - Virtual Thrift Store",
  description:
    "Discover pre-loved treasures and give them a new home. Sustainable shopping made beautiful.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen relative">
        {/* Background Image and Overlay */}
        <div className="fixed inset-0 -z-10">
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: "url('/bg1.png')",
            }}
          ></div>
          {/* Optional dark overlay */}
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>

        {/* Main content */}
        <div className="relative z-0">{children}</div>
      </body>
    </html>
  );
}
