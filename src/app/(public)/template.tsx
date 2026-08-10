/**
 * Route transition: templates remount on navigation, so each page gets a
 * short entrance (420ms fade-rise, CSS-only — see .page-enter). Back/forward
 * and scroll restoration behave natively; reduced-motion renders instantly.
 */
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
