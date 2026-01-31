import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "../ui/Breadcrumb";

type PageContainerProps = {
  children: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  maxWidth?: "max-w-6xl" | "max-w-7xl" | "max-w-[1400px]";
  spacing?: "space-y-6" | "space-y-8";
};

export function PageContainer({
  children,
  breadcrumb,
  maxWidth = "max-w-6xl",
  spacing = "space-y-8",
}: PageContainerProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)]">
      <div
        className={`p-8 ${maxWidth} mx-auto w-full ${spacing} flex-1 min-w-0`}
      >
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="mb-2">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
