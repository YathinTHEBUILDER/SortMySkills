import React from "react";

export default function PageHeader({
  title,
  description,
  action,
}: {
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="text-left">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-2 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

