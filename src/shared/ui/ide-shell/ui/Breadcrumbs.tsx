type BreadcrumbsProps = {
  filePath: string;
};

export const Breadcrumbs = ({ filePath }: BreadcrumbsProps) => {
  const segments = filePath.split("/");

  return (
    <div className="ide-breadcrumbs">
      {segments.map((segment, i) => (
        <span key={i}>
          {i > 0 && <span className="breadcrumb-sep">&rsaquo;</span>}
          <span className={i === segments.length - 1 ? "breadcrumb-active" : "breadcrumb-segment"}>
            {segment}
          </span>
        </span>
      ))}
    </div>
  );
};
