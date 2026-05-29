import React from "react";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-[var(--border-muted)] bg-[var(--surface-card)] ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
  className = "",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 px-6 pt-6 pb-4 ${className}`}>
      <div>
        <h2 className="text-lg font-medium text-text-primary tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardBody({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}
