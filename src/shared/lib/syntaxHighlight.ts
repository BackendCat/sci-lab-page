const escapeHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const highlightDSL = (code: string): string => {
  return escapeHtml(code)
    .replace(
      /\b(bot|page|button|text|keyboard|row|entry|hook|on|emit|state|let|if|else|for|return|import|export|from|deploy|config)\b/g,
      '<span class="sh-kw">$1</span>',
    )
    .replace(
      /\b(beforeRoute|afterRender|onError|validate|track|compile|render|send|reply)\b/g,
      '<span class="sh-fn">$1</span>',
    )
    .replace(/"([^"]*)"/g, '<span class="sh-str">"$1"</span>')
    .replace(/'([^']*)'/g, "<span class=\"sh-str\">'$1'</span>")
    .replace(/(\/\/.*)/g, '<span class="sh-cm">$1</span>')
    .replace(/\b(string|number|boolean|void|any|null|undefined)\b/g, '<span class="sh-tp">$1</span>')
    .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="sh-num">$1</span>')
    .replace(/-&gt;/g, '<span class="sh-op">-&gt;</span>');
};

export const highlightTS = (code: string): string => {
  return escapeHtml(code)
    .replace(
      /\b(import|export|from|const|let|var|function|return|if|else|for|while|new|class|extends|type|interface|async|await|throw|try|catch|default|switch|case|break)\b/g,
      '<span class="sh-kw">$1</span>',
    )
    .replace(
      /\b(Bot|InlineKeyboard|Keyboard|Context|Router|Adapter|Session|MockAdapter)\b/g,
      '<span class="sh-tp">$1</span>',
    )
    .replace(
      /\.(command|action|hears|on|reply|text|row|launch|start|use|send|emit)\b/g,
      '.<span class="sh-fn">$1</span>',
    )
    .replace(/'([^']*)'/g, "<span class=\"sh-str\">'$1'</span>")
    .replace(/"([^"]*)"/g, '<span class="sh-str">"$1"</span>')
    .replace(/`([^`]*)`/g, '<span class="sh-str">`$1`</span>')
    .replace(/(\/\/.*)/g, '<span class="sh-cm">$1</span>')
    .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="sh-num">$1</span>')
    .replace(/@(\w+)/g, '<span class="sh-tag">@$1</span>')
    .replace(/\b(string|number|boolean|void|any|null|undefined|true|false)\b/g, '<span class="sh-tp">$1</span>');
};

export const highlightASM = (code: string): string => {
  return escapeHtml(code)
    .replace(
      /\b(LDI|ADD|SUB|AND|OR|XOR|CMP|JMP|JNZ|JZ|JC|CALL|RET|PUSH|POP|MOV|OUT|IN|NOP|HLT|SHL|SHR|INC|DEC|NOT|RJMP|BRNE|BREQ|SBI|CBI)\b/g,
      '<span class="sh-dir">$1</span>',
    )
    .replace(/\b(R[0-7]|SP|PC|SREG|PORTB|DDRB|PINB|TCCR0A|TCCR0B|TCNT0|OCR0A)\b/g, '<span class="sh-reg">$1</span>')
    .replace(/^(\w+):/gm, '<span class="sh-label">$1:</span>')
    .replace(/(;.*)/g, '<span class="sh-cm">$1</span>')
    .replace(/\b(0x[0-9A-Fa-f]+|\d+)\b/g, '<span class="sh-num">$1</span>')
    .replace(/\.(org|byte|db|dw|def|equ|include|section|text|data|bss)\b/g, '<span class="sh-dir">.$1</span>');
};
