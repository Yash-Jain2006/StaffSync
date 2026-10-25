import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ size = 36, showText = true, to = "/", className = "" }) {
  const content = (
    <div className={`brand-logo-wrap ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }}>
      {/* SVG Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: "drop-shadow(0 2px 8px rgba(56, 189, 248, 0.35))" }}
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0b1329" />
          </linearGradient>

          <linearGradient id="logoBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="logoPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id="logoSecondaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Squircle Badge Background */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill="url(#logoBgGrad)"
          stroke="url(#logoBorderGrad)"
          strokeWidth="1.8"
        />

        {/* Top Node & Flow Arc */}
        <circle cx="24" cy="13" r="3.2" fill="url(#logoPrimaryGrad)" />
        <path
          d="M16 23c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1"
          stroke="url(#logoPrimaryGrad)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom Node & Flow Arc */}
        <path
          d="M32 25c0 3.3-2.7 6-6 6h-4c-3.3 0-6-2.7-6-6v-1a2 2 0 0 1 2-2h1"
          stroke="url(#logoSecondaryGrad)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="35" r="3.2" fill="url(#logoSecondaryGrad)" />

        {/* Center Interlocking Pulse */}
        <circle cx="24" cy="24" r="2.2" fill="#38bdf8" />
      </svg>

      {/* Brand Text */}
      {showText && (
        <span
          className="brand-logo-text"
          style={{
            fontSize: `${Math.round(size * 0.65)}px`,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#f8fafc",
            fontFamily: "system-ui, -apple-system, sans-serif",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <span>Staff</span>
          <span style={{ color: "#38bdf8", marginLeft: "1px" }}>Sync</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: "none", color: "inherit", display: "inline-flex" }}>
        {content}
      </Link>
    );
  }

  return content;
}
