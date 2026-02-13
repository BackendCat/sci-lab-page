export const DeployTopology = () => (
  <g transform="translate(870,450)" opacity="0.06">
    <text x="0" y="-3" fill="#16e0bd" fontFamily="monospace" fontSize="5" fontWeight="600">Deploy Topology</text>
    {/* Edge nodes */}
    <rect x="5" y="8" width="40" height="14" rx="2" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="25" y="18" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">CDN</text>
    <rect x="55" y="8" width="50" height="14" rx="2" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="80" y="18" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">Gateway</text>
    <rect x="115" y="8" width="45" height="14" rx="2" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="137" y="18" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">K8s</text>
    {/* Connections */}
    <line x1="45" y1="15" x2="55" y2="15" stroke="#16e0bd" strokeWidth=".3" />
    <line x1="105" y1="15" x2="115" y2="15" stroke="#16e0bd" strokeWidth=".3" />
    <text x="60" y="33" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".6">region: eu-west-1</text>
    <text x="60" y="40" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".6">replicas: 2..8</text>
  </g>
);
