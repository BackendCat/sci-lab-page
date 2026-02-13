export const DomainModel = () => (
  <g transform="translate(1400,70)" opacity="0.13">
    {/* «aggregate» BotProject */}
    <rect x="0" y="0" width="210" height="145" rx="3" stroke="#16e0bd" strokeWidth="1" fill="none" />
    <line x1="0" y1="20" x2="210" y2="20" stroke="#16e0bd" strokeWidth=".6" />
    <line x1="0" y1="68" x2="210" y2="68" stroke="#16e0bd" strokeWidth=".4" />
    <text x="105" y="10" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«aggregate»</text>
    <text x="105" y="17" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="8" fontWeight="700">BotProject</text>
    <text x="7" y="31" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">- id: UUID</text>
    <text x="7" y="39" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">- name: string</text>
    <text x="7" y="47" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">- ownerId: UUID «FK→User»</text>
    <text x="7" y="55" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">- config: ProjectConfig</text>
    <text x="7" y="63" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">- createdAt: timestamp</text>
    <text x="7" y="79" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">+ addVersion(dsl: string): BotVersion</text>
    <text x="7" y="87" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">+ getActiveVersion(): BotVersion | null</text>
    <text x="7" y="95" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">+ compile(ver: SemVer): CompileResult</text>
    <text x="7" y="103" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">+ deploy(env: EnvConfig): Deployment</text>
    <text x="7" y="111" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">+ rollback(deployId: UUID): void</text>
    <text x="7" y="119" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">+ archive(): void</text>
    <text x="7" y="127" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">+ exportBundle(): TarStream</text>
    <text x="7" y="135" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">+ validatePermissions(u: User): bool</text>
    <text x="7" y="143" fill="#16e0bd" fontFamily="monospace" fontSize="5.8">+ getMetrics(range: TimeRange): Stats</text>
    {/* Composition diamond to BotVersion */}
    <line x1="105" y1="145" x2="105" y2="165" stroke="#16e0bd" strokeWidth=".6" />
    <polygon points="101,145 105,140 109,145 105,150" fill="#16e0bd" />
    <text x="112" y="158" fill="#16e0bd" fontFamily="monospace" fontSize="5">1..*</text>
    {/* BotVersion */}
    <rect x="15" y="168" width="195" height="115" rx="3" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    <line x1="15" y1="188" x2="210" y2="188" stroke="#16e0bd" strokeWidth=".4" />
    <line x1="15" y1="220" x2="210" y2="220" stroke="#16e0bd" strokeWidth=".3" />
    <text x="112" y="178" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«entity»</text>
    <text x="112" y="186" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="7.5" fontWeight="600">BotVersion</text>
    <text x="22" y="199" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">- id: UUID</text>
    <text x="22" y="207" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">- semver: SemVer</text>
    <text x="22" y="215" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">- dslHash: SHA256</text>
    <text x="22" y="230" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">{"+ compile(): Result<AST, Error[]>"}</text>
    <text x="22" y="238" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ validate(): ValidationReport</text>
    <text x="22" y="246" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ diff(prev: BotVersion): Patch[]</text>
    <text x="22" y="254" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ getPages(): FlowPage[]</text>
    <text x="22" y="262" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ freeze(): FrozenSpec</text>
    <text x="22" y="270" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ generateTypes(): TypeModule</text>
    <text x="22" y="278" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ serialize(): Uint8Array</text>
    {/* Composition to FlowPage */}
    <line x1="210" y1="230" x2="240" y2="230" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="210,227 205,230 210,233" fill="#16e0bd" />
    <text x="216" y="226" fill="#16e0bd" fontFamily="monospace" fontSize="5">1..*</text>
    {/* FlowPage (right of BotVersion) */}
    <rect x="242" y="195" width="170" height="105" rx="3" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <line x1="242" y1="213" x2="412" y2="213" stroke="#16e0bd" strokeWidth=".4" />
    <line x1="242" y1="241" x2="412" y2="241" stroke="#16e0bd" strokeWidth=".3" />
    <text x="327" y="206" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="7.5" fontWeight="600">FlowPage</text>
    <text x="249" y="224" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">- route: string</text>
    <text x="249" y="232" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">- renderFn: VTreeFactory</text>
    <text x="249" y="240" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">- hooks: HookRef[]</text>
    <text x="249" y="253" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ render(ctx: Ctx): VTree</text>
    <text x="249" y="261" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ reconcile(prev,next): Patch</text>
    <text x="249" y="269" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ getKeyboard(): KeyLayout</text>
    <text x="249" y="277" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ inferCallbacks(): CbMap</text>
    <text x="249" y="285" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ getInteractions(): Action[]</text>
    <text x="249" y="293" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ serialize(): DSLFragment</text>
  </g>
);
