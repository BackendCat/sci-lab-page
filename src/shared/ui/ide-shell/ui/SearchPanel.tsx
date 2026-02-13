import { useCallback, useEffect, useRef, useState } from "react";

type SearchResult = {
  file: string;
  line: number;
  text: string;
};

type SearchPanelProps = {
  vfsFiles: string[];
  vfsRead: (path: string) => string | null;
  onResultClick: (file: string) => void;
};

export const SearchPanel = ({ vfsFiles, vfsRead, onResultClick }: SearchPanelProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const doSearch = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      const lower = q.toLowerCase();
      const found: SearchResult[] = [];
      for (const file of vfsFiles) {
        const content = vfsRead(file);
        if (!content) continue;
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().includes(lower)) {
            found.push({ file, line: i + 1, text: lines[i].trim() });
            if (found.length >= 100) break;
          }
        }
        if (found.length >= 100) break;
      }
      setResults(found);
    },
    [vfsFiles, vfsRead],
  );

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timerRef.current);
  }, [query, doSearch]);

  // Group results by file
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.file] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel-header">Search</div>
      <div className="search-input-wrap">
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files..."
        />
      </div>
      <div className="search-results">
        {query && results.length === 0 && (
          <div className="search-empty">No results found</div>
        )}
        {Object.entries(grouped).map(([file, matches]) => (
          <div key={file} className="search-file-group">
            <div
              className="search-file-name"
              onClick={() => onResultClick(file)}
            >
              {file} <span className="search-count">{matches.length}</span>
            </div>
            {matches.slice(0, 5).map((m, i) => (
              <div
                key={i}
                className="search-match"
                onClick={() => onResultClick(m.file)}
              >
                <span className="search-line-num">{m.line}</span>
                <span className="search-line-text">
                  {m.text.length > 60 ? m.text.slice(0, 60) + "..." : m.text}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
