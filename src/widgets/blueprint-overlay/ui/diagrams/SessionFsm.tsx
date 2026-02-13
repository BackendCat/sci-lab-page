export const SessionFsm = () => (
  <g transform="translate(700,680)" opacity="0.08">
    <text x="70" y="-2" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">Session State Machine</text>
    {/* States as rounded rects */}
    <rect x="55" y="5" width="55" height="20" rx="10" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <text x="82" y="18" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">INIT</text>
    {/* Arrow INIT -> ACTIVE */}
    <line x1="82" y1="25" x2="82" y2="40" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="80,37 82,41 84,37" fill="#16e0bd" />
    <text x="90" y="35" fill="#16e0bd" fontFamily="monospace" fontSize="4">/start</text>
    <rect x="45" y="42" width="75" height="20" rx="10" stroke="#16e0bd" strokeWidth="1" fill="none" />
    <text x="82" y="55" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">ACTIVE</text>
    {/* Arrow ACTIVE -> ROUTING */}
    <line x1="120" y1="52" x2="155" y2="52" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="152,50 156,52 152,54" fill="#16e0bd" />
    <text x="135" y="48" fill="#16e0bd" fontFamily="monospace" fontSize="4">message</text>
    <rect x="157" y="42" width="65" height="20" rx="10" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <text x="189" y="55" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">ROUTING</text>
    {/* ROUTING -> RENDERING */}
    <line x1="189" y1="62" x2="189" y2="78" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="187,75 189,79 191,75" fill="#16e0bd" />
    <rect x="150" y="80" width="78" height="20" rx="10" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <text x="189" y="93" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">RENDERING</text>
    {/* RENDERING -> ACTIVE (loop back) */}
    <path d="M150 90 Q 130 90 130 70 Q 130 52 120 52" fill="none" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="122,50 118,52 122,54" fill="#16e0bd" />
    <text x="125" y="78" fill="#16e0bd" fontFamily="monospace" fontSize="4">done</text>
    {/* ACTIVE -> EXPIRED */}
    <line x1="82" y1="62" x2="82" y2="85" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="2 2" />
    <polygon points="80,82 82,86 84,82" fill="#16e0bd" />
    <text x="52" y="78" fill="#16e0bd" fontFamily="monospace" fontSize="4">timeout</text>
    <rect x="50" y="88" width="65" height="18" rx="9" stroke="#16e0bd" strokeWidth=".6" fill="none" strokeDasharray="3 2" />
    <text x="82" y="100" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">EXPIRED</text>
  </g>
);
