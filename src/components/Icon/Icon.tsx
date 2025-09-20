import React from "react";

type IconProps = { size?: number; className?: string } & React.SVGProps<SVGSVGElement>;

export const SearchIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const EllipsisIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} {...rest}>
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

export const GearIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v3" />
    <path d="M12 20v3" />
    <path d="M4.22 4.22l2.12 2.12" />
    <path d="M17.66 17.66l2.12 2.12" />
    <path d="M1 12h3" />
    <path d="M20 12h3" />
    <path d="M4.22 19.78l2.12-2.12" />
    <path d="M17.66 6.34l2.12-2.12" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const ComputerIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export const ShuffleIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <path d="M16 3h5v5" />
    <path d="M4 20L21 3" />
    <path d="M21 16v5h-5" />
    <path d="M15 15l6 6" />
    <path d="M4 4l5 5" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ size = 18, className, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

export default {
  SearchIcon,
  PlusIcon,
  EllipsisIcon,
  GearIcon,
  CloseIcon,
  CopyIcon,
  CheckIcon,
  SunIcon,
  MoonIcon,
  ComputerIcon,
  ShuffleIcon,
  EditIcon,
};

