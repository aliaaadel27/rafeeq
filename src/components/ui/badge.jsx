// badge.jsx
import { badgeColors } from "./utils";

export function Badge({ type, children }) {
  return (
    <span className={`px-2 py-1 rounded ${badgeColors[type]}`}>
      {children}
    </span>
  );
}
