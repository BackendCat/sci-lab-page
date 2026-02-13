export const ComponentDiagram = () => (
  <g transform="translate(20,240)" opacity="0.09">
    <text x="0" y="-3" fill="#16e0bd" fontFamily="monospace" fontSize="6" fontWeight="600">Infrastructure Components</text>
    {/* CLI Tool */}
    <rect x="0" y="8" width="90" height="28" rx="4" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="45" y="18" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«tool»</text>
    <text x="45" y="26" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6.5" fontWeight="600">scilab-cli</text>
    {/* Arrow: CLI -> Compiler */}
    <line x1="90" y1="22" x2="120" y2="22" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="116,20 120,22 116,24" fill="#16e0bd" />
    <text x="105" y="18" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4">compile</text>
    {/* Compiler Service */}
    <rect x="122" y="5" width="105" height="34" rx="4" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="174" y="15" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«service»</text>
    <text x="174" y="25" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6.5" fontWeight="600">CompilerSvc</text>
    <text x="174" y="33" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">:3100/compile</text>
    {/* Arrow: Compiler -> Registry */}
    <line x1="174" y1="39" x2="174" y2="62" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="172,58 174,62 176,58" fill="#16e0bd" />
    <text x="180" y="52" fill="#16e0bd" fontFamily="monospace" fontSize="4">push image</text>
    {/* Container Registry */}
    <rect x="130" y="64" width="90" height="28" rx="4" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="175" y="74" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«registry»</text>
    <text x="175" y="83" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6">OCI Registry</text>
    {/* Arrow: Registry -> K8s */}
    <line x1="220" y1="78" x2="255" y2="78" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="251,76 255,78 251,80" fill="#16e0bd" />
    {/* K8s Orchestrator */}
    <rect x="257" y="50" width="110" height="56" rx="4" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <text x="312" y="62" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«orchestrator»</text>
    <text x="312" y="72" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6.5" fontWeight="600">K8s Cluster</text>
    <text x="312" y="82" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">Bot Runtime Pods</text>
    <text x="312" y="90" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">Gateway Pods</text>
    <text x="312" y="98" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">Metrics Collector</text>
    {/* K8s -> NATS */}
    <line x1="312" y1="106" x2="312" y2="125" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="310,121 312,125 314,121" fill="#16e0bd" />
    {/* NATS */}
    <rect x="265" y="127" width="95" height="25" rx="4" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="312" y="138" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«queue»</text>
    <text x="312" y="147" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6">NATS JetStream</text>
    {/* Database */}
    <rect x="0" y="64" width="90" height="28" rx="4" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="45" y="74" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«database»</text>
    <text x="45" y="83" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6">PostgreSQL 16</text>
    {/* DB -> Compiler */}
    <line x1="90" y1="75" x2="122" y2="35" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="3 2" />
    {/* TimescaleDB */}
    <rect x="0" y="105" width="90" height="25" rx="4" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="45" y="115" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«tsdb»</text>
    <text x="45" y="124" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6">TimescaleDB</text>
    {/* Redis */}
    <rect x="0" y="140" width="90" height="25" rx="4" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="45" y="150" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«cache»</text>
    <text x="45" y="159" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6">Redis Cluster</text>
  </g>
);
