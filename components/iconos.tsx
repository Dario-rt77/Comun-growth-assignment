type P = { className?: string };
const base = "h-6 w-6 shrink-0 stroke-verde";
const props = {
  fill: "none",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function IconoBanco({ className = "" }: P) {
  return (
    <svg {...props} className={`${base} ${className}`}>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
      <path d="M3 21h18" />
    </svg>
  );
}

export function IconoTarjeta({ className = "" }: P) {
  return (
    <svg {...props} className={`${base} ${className}`}>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="M2.5 10h19" />
      <path d="M6 15h3.5" />
    </svg>
  );
}

export function IconoGlobo({ className = "" }: P) {
  return (
    <svg {...props} className={`${base} ${className}`}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9.5h17M3.5 14.5h17" />
      <path d="M12 3c2.5 2.6 3.7 5.7 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.7-3.7-9S9.5 5.6 12 3Z" />
    </svg>
  );
}

export function IconoCandado({ className = "" }: P) {
  return (
    <svg {...props} className={`${base} ${className}`}>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      <path d="M12 14v2.5" />
    </svg>
  );
}
