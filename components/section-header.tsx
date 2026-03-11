import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">{eyebrow}</p>
        ) : null}
        <div className="space-y-1.5">
          <h2 className="text-2xl leading-tight font-[family-name:var(--font-serif)] text-text-primary sm:text-[1.9rem]">
            {title}
          </h2>
          {description ? <p className="max-w-2xl text-sm leading-6 text-text-secondary">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
    </div>
  );
}
