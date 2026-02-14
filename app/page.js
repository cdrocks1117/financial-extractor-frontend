"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setMessage("Processing PDF...");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // FIXED: Added /upload endpoint
      console.log("Posting to URL:", "https://financial-extractor-backend-1.onrender.com/upload");
      const response = await fetch("https://financial-extractor-backend-1.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Server error" }));
        throw new Error(errorData.detail || "Server error while processing PDF");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Financial_Output.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMessage("Excel downloaded successfully!");
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error processing PDF. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: "40px", 
      maxWidth: "600px", 
      margin: "0 auto",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <h1 style={{ 
        color: "#e5e7eb",
        marginBottom: "30px"
      }}>
        Financial Statement Research
      </h1>

      <div style={{
        backgroundColor: "#1e293b",
        padding: "30px",
        borderRadius: "8px",
        border: "1px solid #334155"
      }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setError("");
            setMessage("");
          }}
          style={{
            marginBottom: "20px",
            display: "block",
            color: "#e5e7eb"
          }}
        />

        <button 
          onClick={handleUpload} 
          disabled={loading}
          style={{
            backgroundColor: loading ? "#64748b" : "#3b82f6",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "background-color 0.2s"
          }}
        >
          {loading ? "Processing..." : "Process Financial Statement"}
        </button>

        {message && (
          <p style={{ 
            color: "#10b981",
            marginTop: "20px",
            fontWeight: "500"
          }}>
            ✓ {message}
          </p>
        )}

        {error && (
          <p style={{ 
            color: "#ef4444",
            marginTop: "20px",
            fontWeight: "500"
          }}>
            ✗ {error}
          </p>
        )}
      </div>

      <div style={{
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "#1e293b",
        borderRadius: "8px",
        border: "1px solid #334155",
        fontSize: "14px",
        color: "#94a3b8"
      }}>
        <h3 style={{ color: "#e5e7eb", marginTop: 0 }}>How to use:</h3>
        <ol style={{ marginLeft: "20px" }}>
          <li>Upload a PDF financial statement</li>
          <li>Click "Process Financial Statement"</li>
          <li>Wait for the OCR processing to complete</li>
          <li>Download the Excel file with extracted data</li>
        </ol>
      </div>
    </div>
  );
}
