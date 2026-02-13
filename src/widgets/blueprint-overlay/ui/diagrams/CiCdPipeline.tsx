export const CiCdPipeline = () => (
  <g transform="translate(620,520)" opacity="0.07">
    <text x="0" y="8" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">CI/CD Pipeline — BotForge</text>
    <rect x="0" y="14" width="60" height="22" rx="3" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="30" y="28" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">git push</text>
    <line x1="60" y1="25" x2="78" y2="25" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="75,23 79,25 75,27" fill="#16e0bd" />
    <rect x="80" y="14" width="68" height="22" rx="3" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="114" y="22" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">DSL Compile</text>
    <text x="114" y="30" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4">+ Type Check</text>
    <line x1="148" y1="25" x2="166" y2="25" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="163,23 167,25 163,27" fill="#16e0bd" />
    <rect x="168" y="14" width="55" height="22" rx="3" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="195" y="22" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">Build OCI</text>
    <text x="195" y="30" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4">Image</text>
    <line x1="223" y1="25" x2="241" y2="25" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="238,23 242,25 238,27" fill="#16e0bd" />
    <rect x="243" y="14" width="55" height="22" rx="3" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="270" y="22" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">E2E Tests</text>
    <text x="270" y="30" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4">Staging</text>
    <line x1="298" y1="25" x2="316" y2="25" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="313,23 317,25 313,27" fill="#16e0bd" />
    <rect x="318" y="14" width="68" height="22" rx="3" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <text x="352" y="22" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5" fontWeight="600">Deploy Prod</text>
    <text x="352" y="30" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4">Rolling Update</text>
  </g>
);
