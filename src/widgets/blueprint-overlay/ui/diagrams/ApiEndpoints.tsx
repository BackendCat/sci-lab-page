export const ApiEndpoints = () => (
  <g transform="translate(1580,400)" opacity="0.09">
    <rect x="0" y="0" width="310" height="195" rx="3" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <text x="8" y="12" fill="#16e0bd" fontFamily="monospace" fontSize="6.5" fontWeight="700"># BotForge API v1 — Endpoints</text>
    <text x="8" y="23" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">## Projects</text>
    <text x="8" y="32" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"POST   /api/v1/projects                → ProjectDTO"}</text>
    <text x="8" y="40" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"GET    /api/v1/projects/:id           → ProjectDTO"}</text>
    <text x="8" y="48" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"PATCH  /api/v1/projects/:id           → ProjectDTO"}</text>
    <text x="8" y="56" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"DELETE /api/v1/projects/:id           → 204"}</text>
    <text x="8" y="67" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">## Versions</text>
    <text x="8" y="76" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"POST   /api/v1/projects/:id/versions  → VersionDTO"}</text>
    <text x="8" y="84" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"GET    /api/v1/versions/:id/ast       → ASTNode"}</text>
    <text x="8" y="92" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"POST   /api/v1/versions/:id/compile   → CompileResult"}</text>
    <text x="8" y="103" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">## Deployments</text>
    <text x="8" y="112" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"POST   /api/v1/versions/:id/deploy    → DeploymentDTO"}</text>
    <text x="8" y="120" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"GET    /api/v1/deployments/:id/health → HealthStatus"}</text>
    <text x="8" y="128" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"POST   /api/v1/deployments/:id/scale  → {replicas: int}"}</text>
    <text x="8" y="136" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"DELETE /api/v1/deployments/:id        → 204 (teardown)"}</text>
    <text x="8" y="147" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">## Webhooks</text>
    <text x="8" y="156" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"POST   /webhook/telegram/:botId       → 200"}</text>
    <text x="8" y="164" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"POST   /webhook/discord/:botId        → 200"}</text>
    <text x="8" y="175" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">## Sessions</text>
    <text x="8" y="184" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"GET    /api/v1/sessions/:chatId       → SessionState"}</text>
    <text x="8" y="192" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"DELETE /api/v1/sessions/:chatId       → 204 (reset)"}</text>
  </g>
);
