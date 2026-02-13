export const ErDiagram = () => (
  <g transform="translate(20,70)" opacity="0.11">
    {/* workspace table */}
    <rect x="0" y="0" width="125" height="72" rx="2" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <text x="62" y="12" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="7" fontWeight="700">workspace</text>
    <line x1="0" y1="17" x2="125" y2="17" stroke="#16e0bd" strokeWidth=".5" />
    <text x="5" y="27" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">PK id: uuid</text>
    <text x="5" y="35" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   tenant_id: uuid</text>
    <text x="5" y="43" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   name: varchar(255)</text>
    <text x="5" y="51" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   plan: enum(free,pro,ent)</text>
    <text x="5" y="59" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   crdt_clock: bigint</text>
    <text x="5" y="67" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   created_at: timestamptz</text>
    {/* 1:N workspace ||--o{ bot_project */}
    <line x1="125" y1="35" x2="175" y2="35" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="131" y1="29" x2="131" y2="41" stroke="#16e0bd" strokeWidth=".6" />
    <line x1="135" y1="29" x2="135" y2="41" stroke="#16e0bd" strokeWidth=".6" />
    <circle cx="157" cy="35" r="2.5" stroke="#16e0bd" strokeWidth=".4" fill="none" />
    <line x1="163" y1="35" x2="175" y2="27" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="163" y1="35" x2="175" y2="35" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="163" y1="35" x2="175" y2="43" stroke="#16e0bd" strokeWidth=".5" />
    {/* bot_project table */}
    <rect x="175" y="5" width="130" height="78" rx="2" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <text x="240" y="17" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="7" fontWeight="700">bot_project</text>
    <line x1="175" y1="22" x2="305" y2="22" stroke="#16e0bd" strokeWidth=".5" />
    <text x="181" y="32" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">PK id: uuid</text>
    <text x="181" y="40" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">FK workspace_id: uuid</text>
    <text x="181" y="48" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   name: varchar(128)</text>
    <text x="181" y="56" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   platform: enum(tg,dc,slack)</text>
    <text x="181" y="64" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   active_version_id: uuid</text>
    <text x="181" y="72" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   config: jsonb</text>
    <text x="181" y="80" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   status: enum(draft,live,arch)</text>
    {/* 1:N bot_project ||--o{ bot_version */}
    <line x1="305" y1="45" x2="355" y2="45" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="311" y1="39" x2="311" y2="51" stroke="#16e0bd" strokeWidth=".6" />
    <line x1="315" y1="39" x2="315" y2="51" stroke="#16e0bd" strokeWidth=".6" />
    <circle cx="335" cy="45" r="2.5" stroke="#16e0bd" strokeWidth=".4" fill="none" />
    <line x1="343" y1="45" x2="355" y2="37" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="343" y1="45" x2="355" y2="45" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="343" y1="45" x2="355" y2="53" stroke="#16e0bd" strokeWidth=".5" />
    {/* bot_version table */}
    <rect x="355" y="10" width="135" height="72" rx="2" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <text x="422" y="22" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="7" fontWeight="700">bot_version</text>
    <line x1="355" y1="27" x2="490" y2="27" stroke="#16e0bd" strokeWidth=".5" />
    <text x="361" y="37" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">PK id: uuid</text>
    <text x="361" y="45" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">FK bot_project_id: uuid</text>
    <text x="361" y="53" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   semver: varchar(20)</text>
    <text x="361" y="61" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   dsl_hash: char(64)</text>
    <text x="361" y="69" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   ast_blob: bytea</text>
    <text x="361" y="77" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   compiled_at: timestamptz</text>
    {/* 1:N bot_version ||--o{ deployment (vertical) */}
    <line x1="422" y1="82" x2="422" y2="120" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="416" y1="88" x2="428" y2="88" stroke="#16e0bd" strokeWidth=".6" />
    <line x1="416" y1="92" x2="428" y2="92" stroke="#16e0bd" strokeWidth=".6" />
    <circle cx="422" cy="105" r="2.5" stroke="#16e0bd" strokeWidth=".4" fill="none" />
    <line x1="422" y1="112" x2="414" y2="120" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="422" y1="112" x2="422" y2="120" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="422" y1="112" x2="430" y2="120" stroke="#16e0bd" strokeWidth=".5" />
    {/* deployment table */}
    <rect x="355" y="120" width="135" height="70" rx="2" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="422" y="132" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="7" fontWeight="700">deployment</text>
    <line x1="355" y1="137" x2="490" y2="137" stroke="#16e0bd" strokeWidth=".4" />
    <text x="361" y="147" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">PK id: uuid</text>
    <text x="361" y="155" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">FK version_id: uuid</text>
    <text x="361" y="163" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   env: enum(staging,prod)</text>
    <text x="361" y="171" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   replicas: smallint</text>
    <text x="361" y="179" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   health: enum(green,yellow,red)</text>
    <text x="361" y="187" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   deployed_at: timestamptz</text>
    {/* 1:N deployment ||--o{ session */}
    <line x1="490" y1="160" x2="545" y2="160" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="496" y1="154" x2="496" y2="166" stroke="#16e0bd" strokeWidth=".6" />
    <line x1="500" y1="154" x2="500" y2="166" stroke="#16e0bd" strokeWidth=".6" />
    <circle cx="520" cy="160" r="2.5" stroke="#16e0bd" strokeWidth=".4" fill="none" />
    <line x1="533" y1="160" x2="545" y2="152" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="533" y1="160" x2="545" y2="160" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="533" y1="160" x2="545" y2="168" stroke="#16e0bd" strokeWidth=".5" />
    {/* session table */}
    <rect x="545" y="125" width="125" height="70" rx="2" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <text x="607" y="137" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="7" fontWeight="700">session</text>
    <line x1="545" y1="142" x2="670" y2="142" stroke="#16e0bd" strokeWidth=".4" />
    <text x="551" y="152" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">PK id: uuid</text>
    <text x="551" y="160" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">FK deployment_id: uuid</text>
    <text x="551" y="168" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   chat_id: bigint</text>
    <text x="551" y="176" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   state: jsonb</text>
    <text x="551" y="184" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   current_route: varchar</text>
    <text x="551" y="192" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">   ui_revision: int</text>
  </g>
);
