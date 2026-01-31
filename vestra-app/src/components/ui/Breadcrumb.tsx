import { Link } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && (
            <span className="text-xs text-[var(--color-text-muted)]" aria-hidden>
              /
            </span>
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-xs font-medium text-[var(--color-text-primary)]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
