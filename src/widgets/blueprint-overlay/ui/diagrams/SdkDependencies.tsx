export const SdkDependencies = () => (
  <g transform="translate(1200,700)" opacity="0.07">
    <text x="0" y="-4" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">@scibot/sdk — Module Graph</text>
    <rect x="-3" y="-10" width="210" height="110" rx="3" stroke="#16e0bd" strokeWidth=".4" fill="none" />
    {/* Bot module */}
    <rect x="70" y="5" width="60" height="18" rx="3" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <text x="100" y="17" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6" fontWeight="700">Bot</text>
    {/* Router */}
    <rect x="10" y="38" width="55" height="16" rx="3" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="37" y="49" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">Router</text>
    {/* Adapter */}
    <rect x="75" y="38" width="55" height="16" rx="3" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="102" y="49" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">Adapter</text>
    {/* Context */}
    <rect x="140" y="38" width="55" height="16" rx="3" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="167" y="49" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">Context</text>
    {/* Keyboard */}
    <rect x="10" y="68" width="60" height="16" rx="3" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="40" y="79" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">Keyboard</text>
    {/* Transport */}
    <rect x="80" y="68" width="55" height="16" rx="3" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="107" y="79" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">HTTP</text>
    {/* Session */}
    <rect x="145" y="68" width="55" height="16" rx="3" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="172" y="79" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">Session</text>
    {/* Arrows: Bot -> Router, Adapter, Context */}
    <line x1="85" y1="23" x2="37" y2="38" stroke="#16e0bd" strokeWidth=".4" />
    <line x1="100" y1="23" x2="102" y2="38" stroke="#16e0bd" strokeWidth=".4" />
    <line x1="115" y1="23" x2="167" y2="38" stroke="#16e0bd" strokeWidth=".4" />
    {/* Adapter -> HTTP */}
    <line x1="102" y1="54" x2="107" y2="68" stroke="#16e0bd" strokeWidth=".3" />
    {/* Context -> Session */}
    <line x1="167" y1="54" x2="172" y2="68" stroke="#16e0bd" strokeWidth=".3" />
    {/* Router -> Keyboard */}
    <line x1="37" y1="54" x2="40" y2="68" stroke="#16e0bd" strokeWidth=".3" />
  </g>
);
