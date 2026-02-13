export const BotViewFsm = () => (
  <g transform="translate(300,680)" opacity="0.08">
    <text x="0" y="-4" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">Bot View FSM — Page Transitions</text>
    <rect x="-5" y="-10" width="340" height="150" rx="3" stroke="#16e0bd" strokeWidth=".4" fill="none" />
    {/* Start node */}
    <circle cx="30" cy="30" r="8" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <circle cx="30" cy="30" r="3" fill="#16e0bd" />
    {/* start -> /start */}
    <line x1="38" y1="30" x2="62" y2="30" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="59,28 63,30 59,32" fill="#16e0bd" />
    {/* /start page */}
    <rect x="64" y="18" width="70" height="24" rx="4" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <text x="99" y="34" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6" fontWeight="600">start</text>
    {/* start -> main_menu */}
    <line x1="134" y1="30" x2="165" y2="30" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="162,28 166,30 162,32" fill="#16e0bd" />
    <text x="149" y="25" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4">btn:menu</text>
    {/* main_menu page */}
    <rect x="167" y="15" width="80" height="30" rx="4" stroke="#16e0bd" strokeWidth="1" fill="none" />
    <text x="207" y="34" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="6" fontWeight="700">main_menu</text>
    {/* main_menu -> settings */}
    <line x1="247" y1="38" x2="270" y2="55" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="267,52 271,56 266,56" fill="#16e0bd" />
    <rect x="252" y="58" width="70" height="22" rx="4" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="287" y="72" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">settings</text>
    {/* main_menu -> profile */}
    <line x1="247" y1="25" x2="270" y2="10" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="267,8 271,9 268,13" fill="#16e0bd" />
    <rect x="272" y="0" width="56" height="22" rx="4" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="300" y="14" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">profile</text>
    {/* main_menu -> help */}
    <line x1="207" y1="45" x2="207" y2="62" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="205,59 207,63 209,59" fill="#16e0bd" />
    <rect x="177" y="65" width="60" height="22" rx="4" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="207" y="79" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">help</text>
    {/* settings -> main (back arrow) */}
    <path d="M252 70 Q 210 90 175 45" fill="none" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="3 2" />
    <polygon points="177,48 174,43 179,44" fill="#16e0bd" />
    <text x="200" y="100" fill="#16e0bd" fontFamily="monospace" fontSize="4">back</text>
    {/* profile -> main (back arrow) */}
    <path d="M272 14 Q 255 -5 215 15" fill="none" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="3 2" />
    {/* help -> main (back arrow) */}
    <path d="M177 78 Q 155 85 155 50 Q 155 38 167 35" fill="none" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="3 2" />
    {/* Legend */}
    <text x="5" y="90" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".6">Solid = forward navigation</text>
    <text x="5" y="98" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".6">Dashed = back/return</text>
    <text x="5" y="110" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".6">{"Each page renders VTree → Adapter"}</text>
    <text x="5" y="118" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".6">State persisted in session.route</text>
  </g>
);
