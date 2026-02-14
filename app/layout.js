export const metadata = {
  title: "Financial Statement Extractor",
  description: "Extract financial data from PDF statements using OCR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0,
        backgroundColor: "#0f172a",
        color: "#e5e7eb",
        minHeight: "100vh"
      }}>
        {children}
      </body>
    </html>
  );
}
