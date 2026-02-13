// ── Environment-driven constants ──

export const GITHUB_URL = import.meta.env.VITE_GITHUB_URL ?? "https://github.com/BackendCat";
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? "winterrain002@gmail.com";

// Default MCU code constants (only actively imported constants)

export const DEFAULT_MCU_SPEC_CODE = `mcu "SCI-MCU-32" @16MHz {
  flash 32KB
  sram 2KB

  register PORTB 0x25 {
    bit[7] NC
    bit[6] NC
    bit[5] LED     output
    bit[4] BUZZER  output
    bit[3] BTN_A   input
    bit[2] BTN_B   input
    bit[1] TX      output
    bit[0] RX      input
  }

  register DDRC 0x27 {
    bit[7] SDA    bidir
    bit[6] SCL    bidir
    bit[5] CS     output
    bit[4] MOSI   output
    bit[3] MISO   input
    bit[2] SCLK   output
    bit[1] INT0   input
    bit[0] INT1   input
  }

  init {
    set PORTB.LED high
    set PORTB.TX high
    set DDRC.CS high
  }
}`;

export const DEFAULT_MCU_ASM_CODE = `; SCI-MCU-32 LED Blink Program
; Toggles LED on PORTB bit 5
; Uses delay counter loop

    LDI R0, 0x00    ; counter
    LDI R1, 0x20    ; LED mask (bit 5)
    LDI R2, 0x00    ; LED state
    LDI R3, 0x0F    ; delay target

loop:
    ADD R0, 0x01    ; increment counter
    CMP R0, R3      ; reached delay?
    JNZ loop        ; no -> keep counting

    LDI R0, 0x00    ; reset counter
    XOR R2, R1      ; toggle LED bit
    OUT 0x25, R2    ; write to PORTB
    JMP loop        ; repeat

; Try: change R3 to 0x05 for faster blink
; Try: change R1 to 0x30 for LED+BUZZER`;

export const DEFAULT_MCU_MEM_CODE = `; SCI-MCU-32 Memory Map (read-only view)
; ──────────────────────────────────
; Address Range    | Region     | Size
; 0x0000 - 0x7FFF | Flash ROM  | 32KB
; 0x8000 - 0x87FF | SRAM       | 2KB
; 0x8800 - 0x88FF | I/O Regs   | 256B
; 0x8900 - 0x89FF | EEPROM     | 256B
;
; I/O Register Map:
; 0x25  PORTB  [NC|NC|LED|BUZ|BTNA|BTNB|TX|RX]
; 0x27  DDRC   [SDA|SCL|CS|MOSI|MISO|SCLK|INT0|INT1]
; 0x2A  TCCR0  Timer/Counter Control
; 0x2D  ADMUX  ADC Multiplexer
; 0x30  SREG   Status Register [I|T|H|S|V|N|Z|C]
;
; Stack grows downward from 0x87FF
; Interrupt vectors at 0x0000-0x001F`;
