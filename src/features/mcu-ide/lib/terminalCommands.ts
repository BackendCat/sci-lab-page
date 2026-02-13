import type { TerminalLine } from "@/features/cli-terminal/model/types";
import { dispatchCommand } from "@/shared/lib/terminalDispatch";

type CommandHandler = () => TerminalLine[];

const MCU_COMMANDS: Record<string, CommandHandler> = {
  help: () => [
    { type: "info", text: "MCU Toolchain — Available commands:" },
    { type: "", text: "  scilab mcu compile        Compile firmware" },
    { type: "", text: "  scilab mcu flash          Flash to device" },
    { type: "", text: "  scilab mcu reset          Reset MCU" },
    { type: "", text: "  scilab mcu status         Device status" },
    { type: "", text: "  idf.py build              ESP-IDF build" },
    { type: "", text: "  idf.py flash              ESP-IDF flash" },
    { type: "", text: "  docker ps                 List containers" },
    { type: "", text: "  docker logs mcu-dev       Container logs" },
    { type: "", text: "  make                      Build project" },
    { type: "", text: "  make flash                Flash firmware" },
    { type: "", text: "  scilab version            Show version" },
    { type: "", text: "  clear                     Clear terminal" },
  ],
  "scilab help": () => MCU_COMMANDS["help"](),
  "scilab mcu compile": () => [
    { type: "info", text: "Compiling code.asm (target: sci-mcu-32)..." },
    { type: "", text: "  Assembler: 12 instructions, 0 errors" },
    { type: "", text: "  Memory:    24 bytes code, 0 bytes data" },
    { type: "", text: "  Output:    dist/firmware.hex (Intel HEX)" },
    { type: "success", text: "Firmware compiled in 28ms" },
  ],
  "scilab mcu flash": () => [
    { type: "info", text: "Flashing to /dev/ttyUSB0 @ 115200 baud..." },
    { type: "", text: "  Connecting...    OK (SCI-MCU-32 detected)" },
    { type: "", text: "  Erasing flash... OK" },
    { type: "", text: "  Writing:  ████████████████  24/24 bytes" },
    { type: "", text: "  Verifying... OK (checksum match)" },
    { type: "success", text: "Flash complete. Reset device to run." },
  ],
  "scilab mcu reset": () => [
    { type: "info", text: "Resetting SCI-MCU-32..." },
    { type: "", text: "  Sending reset signal..." },
    { type: "success", text: "Device reset. PC=0x00, SP=0xFF" },
  ],
  "scilab mcu status": () => [
    { type: "info", text: "Device: SCI-MCU-32 @ 16MHz" },
    { type: "", text: "  Flash:    32KB (24B used)" },
    { type: "", text: "  SRAM:     2KB" },
    { type: "", text: "  Port:     /dev/ttyUSB0" },
    { type: "", text: "  State:    IDLE" },
    { type: "", text: "  Firmware: v1.0.0 (code.asm)" },
  ],
  "idf.py build": () => [
    { type: "info", text: "Running ESP-IDF build system..." },
    { type: "", text: "  [1/4] Building bootloader..." },
    { type: "", text: "  [2/4] Building partition table..." },
    { type: "", text: "  [3/4] Compiling app (12 source files)..." },
    { type: "", text: "  [4/4] Generating binary..." },
    { type: "success", text: "Build complete: build/firmware.bin (48KB)" },
  ],
  "idf.py flash": () => [
    { type: "info", text: "Flashing via ESP-IDF..." },
    { type: "", text: "  Serial port: /dev/ttyUSB0" },
    { type: "", text: "  Chip:        ESP32-C3" },
    { type: "", text: "  Uploading:   ████████████  48KB" },
    { type: "success", text: "Flash complete. Hard resetting..." },
  ],
  "docker ps": () => [
    { type: "", text: "CONTAINER ID  IMAGE            STATUS        PORTS    NAMES" },
    { type: "", text: "a3f8c21e09   mcu-toolchain    Up 2 hours             mcu-dev" },
    { type: "", text: "b7e4d2f301   openocd:latest   Up 2 hours    3333     mcu-debug" },
  ],
  "docker logs mcu-dev": () => [
    { type: "", text: "[mcu-dev] Toolchain ready (gcc-avr 12.2.0)" },
    { type: "", text: "[mcu-dev] OpenOCD connected to target" },
    { type: "", text: "[mcu-dev] GDB server listening on :3333" },
    { type: "success", text: "[mcu-dev] Ready for firmware upload" },
  ],
  make: () => [
    { type: "", text: "avr-gcc -mmcu=atmega328p -Os -o firmware.elf code.asm" },
    { type: "", text: "avr-objcopy -O ihex firmware.elf firmware.hex" },
    { type: "success", text: "Build complete: firmware.hex (46 bytes)" },
  ],
  "make flash": () => [
    { type: "", text: "avrdude -p m328p -c usbasp -U flash:w:firmware.hex" },
    { type: "", text: "  Reading | ██████████ | 100%  0.4s" },
    { type: "", text: "  Writing | ██████████ | 100%  0.8s" },
    { type: "success", text: "avrdude: verified. Thank you." },
  ],
  "scilab version": () => [
    { type: "", text: "scilab-cli v2.4.1 (build 20260128)" },
  ],
  ls: () => [
    { type: "", text: "include/  dist/  code.asm  mcu_spec.mcuconf  memory.map  Makefile  README.md" },
  ],
  "ls include": () => [{ type: "", text: "registers.h  interrupts.h" }],
  pwd: () => [{ type: "", text: "/home/dev/mcu-project" }],
  clear: () => [],
};

export const processMcuCommand = (
  raw: string,
): TerminalLine[] | "clear" => dispatchCommand(raw, MCU_COMMANDS);
