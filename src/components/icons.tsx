import React from "react";
type P = React.SVGProps<SVGSVGElement>;
const S = (p: P): any => ({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", ...p });

export const LeafIcon = (p: P) => (<svg {...S(p)}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>);
export const SearchIcon = (p: P) => (<svg {...S(p)}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>);
export const BagIcon = (p: P) => (<svg {...S(p)}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>);
export const HeartIcon = (p: P) => (<svg {...S(p)}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>);
export const UserIcon = (p: P) => (<svg {...S(p)}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
export const MenuIcon = (p: P) => (<svg {...S(p)}><path d="M4 6h16M4 12h16M4 18h16"/></svg>);
export const XIcon = (p: P) => (<svg {...S(p)}><path d="M18 6 6 18M6 6l12 12"/></svg>);
export const PlusIcon = (p: P) => (<svg {...S(p)}><path d="M12 5v14M5 12h14"/></svg>);
export const MinusIcon = (p: P) => (<svg {...S(p)}><path d="M5 12h14"/></svg>);
export const TrashIcon = (p: P) => (<svg {...S(p)}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
export const CheckIcon = (p: P) => (<svg {...S(p)}><path d="M20 6 9 17l-5-5"/></svg>);
export const ChevronDownIcon = (p: P) => (<svg {...S(p)}><path d="m6 9 6 6 6-6"/></svg>);
export const ArrowRightIcon = (p: P) => (<svg {...S(p)}><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
export const TruckIcon = (p: P) => (<svg {...S(p)}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>);
export const ShieldIcon = (p: P) => (<svg {...S(p)}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>);
export const SunIcon = (p: P) => (<svg {...S(p)}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>);
export const DropletIcon = (p: P) => (<svg {...S(p)}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>);
export const ThermometerIcon = (p: P) => (<svg {...S(p)}><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>);
export const WindIcon = (p: P) => (<svg {...S(p)}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>);
export const PackageIcon = (p: P) => (<svg {...S(p)}><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/></svg>);
export const MapPinIcon = (p: P) => (<svg {...S(p)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>);
export const StarIcon = ({ className = "", filled = true }: { className?: string; filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);