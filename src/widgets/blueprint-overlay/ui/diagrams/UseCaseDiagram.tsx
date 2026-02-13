export const UseCaseDiagram = () => (
  <g transform="translate(200,470)" opacity="0.07">
    <text x="115" y="8" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">SCI-LAB — Use Case Overview</text>
    {/* System boundary */}
    <rect x="45" y="14" width="180" height="100" rx="8" stroke="#16e0bd" strokeWidth=".5" strokeDasharray="3,2" fill="none" />
    <text x="135" y="24" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4" fontStyle="italic">SCI-LAB Platform</text>
    {/* Actor: Developer (stick figure) */}
    <circle cx="10" cy="42" r="4" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <line x1="10" y1="46" x2="10" y2="58" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="3" y1="52" x2="17" y2="52" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="10" y1="58" x2="4" y2="66" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="10" y1="58" x2="16" y2="66" stroke="#16e0bd" strokeWidth=".5" />
    <text x="10" y="73" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4">Developer</text>
    {/* Use cases (ellipses) */}
    <ellipse cx="100" cy="35" rx="38" ry="8" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="100" y="37" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4">Build Bot (DSL)</text>
    <ellipse cx="100" cy="57" rx="38" ry="8" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="100" y="59" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4">Emulate MCU</text>
    <ellipse cx="100" cy="79" rx="38" ry="8" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="100" y="81" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4">Deploy &amp; Monitor</text>
    <ellipse cx="180" cy="46" rx="35" ry="8" stroke="#16e0bd" strokeWidth=".4" fill="none" />
    <text x="180" y="48" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">«extends» Visual Edit</text>
    <ellipse cx="180" cy="68" rx="35" ry="8" stroke="#16e0bd" strokeWidth=".4" fill="none" />
    <text x="180" y="70" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">«includes» Auth</text>
    {/* Association lines */}
    <line x1="17" y1="47" x2="62" y2="35" stroke="#16e0bd" strokeWidth=".4" />
    <line x1="17" y1="52" x2="62" y2="57" stroke="#16e0bd" strokeWidth=".4" />
    <line x1="17" y1="57" x2="62" y2="79" stroke="#16e0bd" strokeWidth=".4" />
    <line x1="138" y1="35" x2="145" y2="40" stroke="#16e0bd" strokeWidth=".3" strokeDasharray="2,1" />
    <line x1="138" y1="57" x2="145" y2="62" stroke="#16e0bd" strokeWidth=".3" strokeDasharray="2,1" />
  </g>
);
