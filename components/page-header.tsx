import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export default function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h1 className="font-headline text-3xl font-bold tracking-tight lg:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
