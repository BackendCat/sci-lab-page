export const SequenceDiagram = () => (
  <g transform="translate(1100,290)" opacity="0.10">
    {/* Title */}
    <text x="0" y="-5" fill="#16e0bd" fontFamily="monospace" fontSize="6" fontWeight="600">sd BotMessageFlow</text>
    <rect x="-5" y="-12" width="480" height="370" rx="3" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    {/* 6 Lifelines */}
    <line x1="35" y1="18" x2="35" y2="345" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="4 3" />
    <line x1="110" y1="18" x2="110" y2="345" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="4 3" />
    <line x1="195" y1="18" x2="195" y2="345" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="4 3" />
    <line x1="280" y1="18" x2="280" y2="345" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="4 3" />
    <line x1="365" y1="18" x2="365" y2="345" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="4 3" />
    <line x1="445" y1="18" x2="445" y2="345" stroke="#16e0bd" strokeWidth=".4" strokeDasharray="4 3" />
    {/* 6 Participant boxes */}
    <rect x="5" y="2" width="60" height="14" rx="2" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="35" y="12" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">Telegram</text>
    <rect x="77" y="2" width="66" height="14" rx="2" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="110" y="12" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">Gateway</text>
    <rect x="160" y="2" width="70" height="14" rx="2" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="195" y="12" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">FlowEngine</text>
    <rect x="248" y="2" width="64" height="14" rx="2" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="280" y="12" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">Redis</text>
    <rect x="335" y="2" width="60" height="14" rx="2" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="365" y="12" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">Adapter</text>
    <rect x="415" y="2" width="60" height="14" rx="2" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="445" y="12" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">Database</text>
    {/* Activation boxes */}
    <rect x="107" y="28" width="6" height="50" fill="rgba(22,224,189,0.05)" stroke="#16e0bd" strokeWidth=".3" />
    <rect x="192" y="52" width="6" height="130" fill="rgba(22,224,189,0.05)" stroke="#16e0bd" strokeWidth=".3" />
    <rect x="277" y="65" width="6" height="30" fill="rgba(22,224,189,0.05)" stroke="#16e0bd" strokeWidth=".3" />
    <rect x="362" y="135" width="6" height="55" fill="rgba(22,224,189,0.05)" stroke="#16e0bd" strokeWidth=".3" />
    <rect x="442" y="200" width="6" height="35" fill="rgba(22,224,189,0.05)" stroke="#16e0bd" strokeWidth=".3" />
    {/* 1: Telegram -> Gateway: POST /webhook */}
    <line x1="35" y1="33" x2="107" y2="33" stroke="#16e0bd" strokeWidth=".6" />
    <polygon points="103,31 107,33 103,35" fill="#16e0bd" />
    <text x="71" y="30" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">POST /webhook</text>
    <text x="71" y="40" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".7">{"{update_id, message:{chat_id, text}}"}</text>
    {/* 2: Gateway -> FlowEngine: route(ctx) */}
    <line x1="113" y1="55" x2="192" y2="55" stroke="#16e0bd" strokeWidth=".6" />
    <polygon points="188,53 192,55 188,57" fill="#16e0bd" />
    <text x="152" y="52" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">engine.route(ctx)</text>
    {/* 3: FlowEngine -> Redis: load session */}
    <line x1="198" y1="70" x2="277" y2="70" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="273,68 277,70 273,72" fill="#16e0bd" />
    <text x="237" y="67" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">{"GET session:{chatId}"}</text>
    {/* 4: Redis return */}
    <line x1="277" y1="82" x2="198" y2="82" stroke="#16e0bd" strokeWidth=".5" strokeDasharray="3 2" />
    <polygon points="202,80 198,82 202,84" fill="none" stroke="#16e0bd" strokeWidth=".4" />
    <text x="237" y="79" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".7">{"SessionState{route, ctx, uiRev}"}</text>
    {/* 5: FlowEngine self-call: match route */}
    <line x1="198" y1="96" x2="218" y2="96" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="218" y1="96" x2="218" y2="108" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="218" y1="108" x2="198" y2="108" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="202,106 198,108 202,110" fill="#16e0bd" />
    <text x="226" y="103" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">matchRoute(msg, routes)</text>
    {/* 6: FlowEngine self-call: render page */}
    <line x1="198" y1="118" x2="218" y2="118" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="218" y1="118" x2="218" y2="130" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="218" y1="130" x2="198" y2="130" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="202,128 198,130 202,132" fill="#16e0bd" />
    <text x="226" y="125" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">page.render(ctx): VTree</text>
    {/* 7: FlowEngine -> Adapter: send vtree */}
    <line x1="198" y1="142" x2="362" y2="142" stroke="#16e0bd" strokeWidth=".6" />
    <polygon points="358,140 362,142 358,144" fill="#16e0bd" />
    <text x="280" y="139" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">adapter.send(vtree)</text>
    {/* 8: Adapter self-call: reconcile */}
    <line x1="368" y1="152" x2="388" y2="152" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="388" y1="152" x2="388" y2="164" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="388" y1="164" x2="368" y2="164" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="372,162 368,164 372,166" fill="#16e0bd" />
    <text x="396" y="159" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">reconcile(prev, next)</text>
    {/* 9: Adapter return to FlowEngine */}
    <line x1="362" y1="178" x2="198" y2="178" stroke="#16e0bd" strokeWidth=".5" strokeDasharray="3 2" />
    <polygon points="202,176 198,178 202,180" fill="none" stroke="#16e0bd" strokeWidth=".4" />
    <text x="280" y="175" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">{"PatchResult{edited:2, sent:1}"}</text>
    {/* 10: FlowEngine -> Redis: persist state */}
    <line x1="198" y1="195" x2="277" y2="195" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="273,193 277,195 273,197" fill="#16e0bd" />
    <text x="237" y="192" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">{"SET session:{chatId}"}</text>
    {/* 11: FlowEngine -> Database: log event */}
    <line x1="198" y1="210" x2="442" y2="210" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="438,208 442,210 438,212" fill="#16e0bd" />
    <text x="320" y="207" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">INSERT event_log(chatId, route, ts)</text>
    {/* 12: Database return */}
    <line x1="442" y1="222" x2="198" y2="222" stroke="#16e0bd" strokeWidth=".5" strokeDasharray="3 2" />
    <polygon points="202,220 198,222 202,224" fill="none" stroke="#16e0bd" strokeWidth=".4" />
    <text x="320" y="219" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".7">{"OK {event_id: uuid}"}</text>
    {/* 13: FlowEngine return to Gateway */}
    <line x1="192" y1="242" x2="113" y2="242" stroke="#16e0bd" strokeWidth=".5" strokeDasharray="3 2" />
    <polygon points="117,240 113,242 117,244" fill="none" stroke="#16e0bd" strokeWidth=".4" />
    <text x="152" y="239" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">{"RouteResult{nextRoute, newState}"}</text>
    {/* 14: Gateway -> Telegram HTTP 200 */}
    <line x1="107" y1="258" x2="35" y2="258" stroke="#16e0bd" strokeWidth=".5" strokeDasharray="3 2" />
    <polygon points="39,256 35,258 39,260" fill="none" stroke="#16e0bd" strokeWidth=".4" />
    <text x="71" y="255" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5">HTTP 200 OK</text>
    {/* Alt fragment: error path */}
    <rect x="5" y="275" width="270" height="52" rx="2" stroke="#16e0bd" strokeWidth=".35" fill="none" strokeDasharray="5 3" />
    <text x="10" y="284" fill="#16e0bd" fontFamily="monospace" fontSize="4.5" fontWeight="600">[alt] onError</text>
    <line x1="5" y1="287" x2="55" y2="287" stroke="#16e0bd" strokeWidth=".3" />
    <line x1="110" y1="296" x2="195" y2="296" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="191,294 195,296 191,298" fill="#16e0bd" />
    <text x="152" y="293" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">engine.handleError(ctx,err)</text>
    <line x1="195" y1="310" x2="110" y2="310" stroke="#16e0bd" strokeWidth=".5" strokeDasharray="3 2" />
    <polygon points="114,308 110,310 114,312" fill="none" stroke="#16e0bd" strokeWidth=".4" />
    <text x="152" y="307" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4" opacity=".7">{"ErrorPage{text, retryBtn}"}</text>
    {/* Note box */}
    <rect x="290" y="280" width="180" height="48" rx="2" stroke="#16e0bd" strokeWidth=".4" fill="none" />
    <line x1="290" y1="280" x2="302" y2="280" stroke="#16e0bd" strokeWidth=".4" />
    <line x1="302" y1="280" x2="302" y2="287" stroke="#16e0bd" strokeWidth=".4" />
    <line x1="302" y1="287" x2="295" y2="287" stroke="#16e0bd" strokeWidth=".4" />
    <text x="295" y="294" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">VTree reconciliation uses editable</text>
    <text x="295" y="301" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">anchor strategy. canEdit=true patches</text>
    <text x="295" y="308" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">messages in-place. Session state is</text>
    <text x="295" y="315" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">cached in Redis with 24h TTL. Events</text>
    <text x="295" y="322" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">are persisted to PostgreSQL for audit.</text>
  </g>
);
