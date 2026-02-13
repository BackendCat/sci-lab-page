export const TelegramProtocol = () => (
  <g transform="translate(20,690)" opacity="0.07">
    <text x="0" y="-3" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">Telegram Update Protocol</text>
    <rect x="-3" y="-9" width="190" height="95" rx="3" stroke="#16e0bd" strokeWidth=".4" fill="none" />
    {/* Nested JSON structure visualization */}
    <rect x="5" y="6" width="170" height="16" rx="2" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="10" y="17" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"Update { update_id: int }"}</text>
    <rect x="15" y="26" width="150" height="16" rx="2" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="20" y="37" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"Message { chat, text, from }"}</text>
    <rect x="25" y="46" width="130" height="16" rx="2" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="30" y="57" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"Chat { id, type, title }"}</text>
    <line x1="5" y1="22" x2="15" y2="26" stroke="#16e0bd" strokeWidth=".3" />
    <line x1="15" y1="42" x2="25" y2="46" stroke="#16e0bd" strokeWidth=".3" />
    <text x="10" y="74" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".7">{"| callback_query → action handlers"}</text>
    <text x="10" y="82" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".7">{"| inline_query  → inline results"}</text>
  </g>
);
