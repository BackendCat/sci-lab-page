type Extension = {
  name: string;
  version: string;
  color: string;
  description: string;
  provides?: string;
};

const DEFAULT_EXTENSIONS: Extension[] = [
  { name: "FlowSpec Language", version: "1.2.0", color: "#569CD6", description: "Syntax highlighting, validation, and IntelliSense for FlowSpec DSL", provides: "Chat Preview, Flow Graph" },
  { name: "SciBot SDK", version: "2.0.0", color: "#16E0BD", description: "TypeScript types, IntelliSense, and bot preview for @scibot/sdk", provides: "Telegram Preview" },
  { name: "MCU Assembly", version: "0.8.3", color: "#C586C0", description: "Assembly syntax, register hints, and hardware spec support", provides: "Registers, Memory View" },
  { name: "Prettier", version: "3.2.0", color: "#C596C0", description: "Code formatter for TypeScript, JSON, YAML" },
  { name: "ESLint", version: "9.5.0", color: "#4B32C3", description: "JavaScript/TypeScript linter with auto-fix" },
  { name: "Git Graph", version: "1.30.0", color: "#F14E32", description: "View git log as a graph" },
  { name: "Error Lens", version: "3.16.0", color: "#EAB308", description: "Inline error and warning highlights" },
  { name: "Material Icons", version: "4.0.0", color: "#90A4AE", description: "File icon theme" },
];

type ExtensionsPanelProps = {
  extensions?: Extension[];
};

export const ExtensionsPanel = ({ extensions }: ExtensionsPanelProps) => {
  const exts = extensions ?? DEFAULT_EXTENSIONS;

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel-header">Extensions</div>
      <div className="ext-search">
        <input
          type="text"
          placeholder="Search extensions..."
          className="ext-search-input"
          readOnly
        />
      </div>
      <div className="ext-section">
        <div className="ext-section-title">Installed — {exts.length}</div>
        {exts.map((ext) => (
          <div key={ext.name} className="ext-item">
            <div className="ext-icon" style={{ background: ext.color }} />
            <div className="ext-info">
              <div className="ext-name">{ext.name}</div>
              <div className="ext-desc">{ext.description}</div>
              {ext.provides && (
                <div className="ext-provides">Provides: {ext.provides}</div>
              )}
              <div className="ext-version">v{ext.version}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export type { Extension };
