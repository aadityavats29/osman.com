import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-8 ${
        wide ? "max-w-(--container-site)" : "max-w-(--container-prose)"
      } ${className}`}
    >
      {children}
    </div>
  );
}
