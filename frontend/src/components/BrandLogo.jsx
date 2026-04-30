function BrandLogo({ className = 'brand-logo' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="DraftLane logo">
      <defs>
        <linearGradient id="draftlane-fill" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent-main)" />
          <stop offset="1" stopColor="var(--sage-main)" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="16" fill="url(#draftlane-fill)" opacity="0.18" />
      <path
        d="M20 17.5h16.2c8.9 0 14.3 4.9 14.3 13.1 0 8.4-5.7 13.4-15.2 13.4H28.6V50H20V17.5Zm15.6 19.7c4.1 0 6.3-2.1 6.3-5.9 0-3.6-2.2-5.6-6.3-5.6h-7v11.5h7Z"
        fill="var(--ink-main)"
      />
      <path
        d="M43.8 20.8 26.9 49.4"
        stroke="var(--ink-main)"
        strokeWidth="4.2"
        strokeLinecap="round"
        opacity="0.88"
      />
    </svg>
  )
}

export default BrandLogo