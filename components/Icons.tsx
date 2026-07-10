import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function LockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="3" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.4" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" />
      <path d="M3 12l9 4.5L21 12" />
      <path d="M3 16l9 4.5L21 16" />
    </svg>
  );
}

export function ShuffleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h3.5c1.5 0 2.6 1 3.4 2.2l2.2 3.6c.8 1.2 1.9 2.2 3.4 2.2H20" />
      <path d="M4 17h3.5c1.5 0 2.6-1 3.4-2.2" />
      <path d="M14 7h2.7c1.5 0 2.6 1 2.6 1" />
      <path d="M17.5 4.5 20.5 7l-3 2.5" />
      <path d="M17.5 12.5 20.5 15l-3 2.5" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 4 3.5 11.2c-.8.35-.75 1.5.08 1.78l6.2 2.05 2.05 6.2c.28.83 1.43.88 1.78.08L20 4Z" />
      <path d="M9.9 15.1 20 4" />
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="6" width="17" height="13" rx="3" />
      <path d="M3.5 10h17" />
      <circle cx="16.5" cy="14" r="1.2" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 19 6v5c0 4.5-3 8-7 9.5C8 19 5 15.5 5 11V6l7-2.5Z" />
      <path d="m9 11.5 2 2 4-4.5" />
    </svg>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 4 20 20" />
      <path d="M9.6 9.7a3 3 0 0 0 4.2 4.2" />
      <path d="M6.5 6.9C4.6 8.1 3.2 9.9 2.5 12c1.6 4 5.3 6.5 9.5 6.5 1.5 0 2.9-.3 4.2-.9" />
      <path d="M9.8 5.7A9.9 9.9 0 0 1 12 5.5c4.2 0 7.9 2.5 9.5 6.5-.5 1.3-1.3 2.5-2.3 3.5" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12C4.1 8 7.8 5.5 12 5.5S19.9 8 21.5 12c-1.6 4-5.3 6.5-9.5 6.5S4.1 16 2.5 12Z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  );
}

export function CubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 20 7.3v9.4L12 21l-8-4.3V7.3L12 3Z" />
      <path d="M4 7.3 12 12l8-4.7" />
      <path d="M12 12v9" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />
    </svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 19c-4.5 1.4-4.5-2.3-6-2.8m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.5 1.3a12 12 0 0 0-6.3 0C6.5 3.3 5.5 3.6 5.5 3.6a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 10c0 4.6 2.7 5.7 5.5 6-.4.4-.7 1-.6 1.7V21" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function Logo(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" {...props}>
      <defs>
        <linearGradient id="ss-logo" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0" stopColor="#7c5cff" />
          <stop offset="1" stopColor="#37e5ff" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="34" height="34" rx="12" fill="url(#ss-logo)" />
      <path
        d="M14 15c0-2 2-3.5 6-3.5s6 1.2 6 3-1.6 2.6-6 3.4-6 1.6-6 3.6 2 3.5 6 3.5 6-1.5 6-3.5"
        stroke="#0b0920"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
