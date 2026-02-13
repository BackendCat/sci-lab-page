export const CliReference = () => (
  <g transform="translate(960,70)" opacity="0.08">
    <rect x="0" y="0" width="260" height="135" rx="3" stroke="#16e0bd" strokeWidth=".5" fill="none" />
    <text x="8" y="12" fill="#16e0bd" fontFamily="monospace" fontSize="6" fontWeight="700"># scilab-cli Quick Reference</text>
    <text x="8" y="24" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"$ scilab init <project-name>"}</text>
    <text x="8" y="33" fill="#16e0bd" fontFamily="monospace" fontSize="5">$ scilab compile ./src/bot.flow --target tg</text>
    <text x="8" y="42" fill="#16e0bd" fontFamily="monospace" fontSize="5">$ scilab validate ./src/bot.flow</text>
    <text x="8" y="51" fill="#16e0bd" fontFamily="monospace" fontSize="5">$ scilab dev --hot-reload --port 3000</text>
    <text x="8" y="60" fill="#16e0bd" fontFamily="monospace" fontSize="5">$ scilab deploy --env staging --replicas 2</text>
    <text x="8" y="69" fill="#16e0bd" fontFamily="monospace" fontSize="5">$ scilab deploy --env production --approve</text>
    <text x="8" y="78" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"$ scilab rollback --deployment-id <uuid>"}</text>
    <text x="8" y="87" fill="#16e0bd" fontFamily="monospace" fontSize="5">{"$ scilab logs --follow --deployment <id>"}</text>
    <text x="8" y="96" fill="#16e0bd" fontFamily="monospace" fontSize="5">$ scilab health --all</text>
    <text x="8" y="108" fill="#16e0bd" fontFamily="monospace" fontSize="5.5" fontWeight="600">## MCU Toolchain</text>
    <text x="8" y="117" fill="#16e0bd" fontFamily="monospace" fontSize="5">$ scilab mcu compile ./firmware.asm --arch avr8</text>
    <text x="8" y="126" fill="#16e0bd" fontFamily="monospace" fontSize="5">$ scilab mcu flash --port /dev/ttyUSB0 --baud 115200</text>
    <text x="8" y="135" fill="#16e0bd" fontFamily="monospace" fontSize="5">$ scilab mcu monitor --serial --hex-dump</text>
  </g>
);
