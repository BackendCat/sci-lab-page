export const ChipPinout = () => (
  <g transform="translate(20,470)" opacity="0.10">
    <text x="65" y="-5" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">SCI-MCU-32 — 28-DIP Pinout</text>
    {/* Chip body */}
    <rect x="22" y="0" width="86" height="165" rx="2" stroke="#16e0bd" strokeWidth=".8" fill="none" />
    {/* Notch at top */}
    <path d="M 60,0 A 5,5 0 0,1 70,0" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    {/* Pin 1 dot */}
    <circle cx="30" cy="8" r="1.5" fill="#16e0bd" opacity=".6" />
    {/* Left pins (1-14) */}
    <line x1="0" y1="12" x2="22" y2="12" stroke="#16e0bd" strokeWidth=".4" />
    <text x="-2" y="14" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="4">PC6/RST</text>
    <text x="25" y="14" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">1</text>
    <line x1="0" y1="24" x2="22" y2="24" stroke="#16e0bd" strokeWidth=".4" />
    <text x="-2" y="26" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="4">PD0/RXD</text>
    <text x="25" y="26" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">2</text>
    <line x1="0" y1="36" x2="22" y2="36" stroke="#16e0bd" strokeWidth=".4" />
    <text x="-2" y="38" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="4">PD1/TXD</text>
    <text x="25" y="38" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">3</text>
    <line x1="0" y1="48" x2="22" y2="48" stroke="#16e0bd" strokeWidth=".4" />
    <text x="-2" y="50" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="4">PD2/INT0</text>
    <text x="25" y="50" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">4</text>
    <line x1="0" y1="60" x2="22" y2="60" stroke="#16e0bd" strokeWidth=".4" />
    <text x="-2" y="62" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="4">PD3/INT1</text>
    <text x="25" y="62" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">5</text>
    <line x1="0" y1="72" x2="22" y2="72" stroke="#16e0bd" strokeWidth=".4" />
    <text x="-2" y="74" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="4">PD4/T0</text>
    <text x="25" y="74" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">6</text>
    <line x1="0" y1="84" x2="22" y2="84" stroke="#16e0bd" strokeWidth=".4" />
    <text x="-2" y="86" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="4">VCC</text>
    <text x="25" y="86" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">7</text>
    {/* Right pins (15-28) */}
    <line x1="108" y1="12" x2="130" y2="12" stroke="#16e0bd" strokeWidth=".4" />
    <text x="132" y="14" fill="#16e0bd" fontFamily="monospace" fontSize="4">PC5/SCL</text>
    <text x="103" y="14" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">28</text>
    <line x1="108" y1="24" x2="130" y2="24" stroke="#16e0bd" strokeWidth=".4" />
    <text x="132" y="26" fill="#16e0bd" fontFamily="monospace" fontSize="4">PC4/SDA</text>
    <text x="103" y="26" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">27</text>
    <line x1="108" y1="36" x2="130" y2="36" stroke="#16e0bd" strokeWidth=".4" />
    <text x="132" y="38" fill="#16e0bd" fontFamily="monospace" fontSize="4">PC3/ADC3</text>
    <text x="103" y="38" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">26</text>
    <line x1="108" y1="48" x2="130" y2="48" stroke="#16e0bd" strokeWidth=".4" />
    <text x="132" y="50" fill="#16e0bd" fontFamily="monospace" fontSize="4">PC2/ADC2</text>
    <text x="103" y="50" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">25</text>
    <line x1="108" y1="60" x2="130" y2="60" stroke="#16e0bd" strokeWidth=".4" />
    <text x="132" y="62" fill="#16e0bd" fontFamily="monospace" fontSize="4">AVCC</text>
    <text x="103" y="62" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">20</text>
    <line x1="108" y1="72" x2="130" y2="72" stroke="#16e0bd" strokeWidth=".4" />
    <text x="132" y="74" fill="#16e0bd" fontFamily="monospace" fontSize="4">PB5/SCK</text>
    <text x="103" y="74" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">19</text>
    <line x1="108" y1="84" x2="130" y2="84" stroke="#16e0bd" strokeWidth=".4" />
    <text x="132" y="86" fill="#16e0bd" fontFamily="monospace" fontSize="4">PB4/MISO</text>
    <text x="103" y="86" textAnchor="end" fill="#16e0bd" fontFamily="monospace" fontSize="3.5">18</text>
  </g>
);
