import { Button } from "@/components/ui/button";

export default function PageHeader({title,description,children,}) {

  return (

    <div className="mb-6 mt-1 flex items-center justify-between flex-col gap-4 sm:flex-row sm:items-center sm:justify-between  ">

      <div>

        <h1 className="sm:text-2xl font-bold tracking-tight text-xl">
          {title}
        </h1>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>

      </div>

      <div className="flex w-full justify-center sm:w-auto">
        {children}
      </div>

    </div>

  );
}