export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <rect x="8" y="18" width="17" height="68" rx="5" fill="#1b3a6b" />
      <rect x="75" y="18" width="17" height="68" rx="5" fill="#1b3a6b" />
      <circle cx="50" cy="20" r="10" fill="#f6a800" />
      <path
        d="M14 62 C 32 42, 44 42, 51 53"
        stroke="#2996d9"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M86 62 C 68 42, 56 42, 49 53"
        stroke="#5fae33"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight ${className}`}>
      <span className="text-navy">HUMAN</span>
      <span className="text-brand-green">ADE</span>
    </span>
  );
}
