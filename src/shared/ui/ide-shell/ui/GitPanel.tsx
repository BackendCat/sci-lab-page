type GitPanelProps = {
  files?: string[];
};

export const GitPanel = ({ files = [] }: GitPanelProps) => {
  const displayFiles = files.length > 0
    ? files.slice(0, 5)
    : ["src/app.ts", "src/hooks.ts", "config/deploy.yaml"];

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel-header">Source Control</div>
      <div className="git-section">
        <div className="git-section-title">
          Changes <span className="git-badge">{displayFiles.length}</span>
        </div>
        {displayFiles.map((f, i) => (
          <div key={i} className="git-file">
            <span className={i < 2 ? "git-status-m" : "git-status-a"}>
              {i < 2 ? "M" : "A"}
            </span>
            <span className="git-file-name">{f.split("/").pop()}</span>
            <span className="git-file-path">{f}</span>
          </div>
        ))}
      </div>
      <div className="git-info">
        <div><span className="git-icon-branch">&#9095;</span> main</div>
        <div className="git-sync">0 &uarr; 0 &darr;</div>
      </div>
    </div>
  );
};
