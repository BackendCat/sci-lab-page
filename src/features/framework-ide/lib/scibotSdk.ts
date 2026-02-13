/* ═══ SCIBOT SDK RUNTIME ═══ */

type Extra = {
  reply_markup?: KeyboardMarkup | BuiltMarkup;
};

type BuiltMarkup = {
  type: string;
  rows: KeyboardButton[][];
};

export type KeyboardButton = {
  text: string;
  type: "callback" | "reply" | "url";
  callback_data?: string;
  url?: string;
};

type Update = {
  message: { text: string };
  callback_query?: { data: string } | null;
  match?: string | null;
};

type Handler = (ctx: Context) => void;

type HearsEntry = {
  pattern: string | RegExp;
  handler: Handler;
};

type KeyboardMarkup = {
  build: () => BuiltMarkup;
};

export type ChatOutput = {
  type: "bot" | "user" | "error";
  text: string;
  buttons?: KeyboardButton[][];
};

/* Context */
export class Context {
  adapter: MockAdapter;
  message: { text: string };
  from = { first_name: "User", username: "user" };
  callbackQuery: { data: string } | null;
  match: string | null;

  constructor(adapter: MockAdapter, update: Update) {
    this.adapter = adapter;
    this.message = update.message || { text: "" };
    this.callbackQuery = update.callback_query || null;
    this.match = update.match || null;
  }

  reply(text: string, extra?: Extra): void {
    this.adapter._send(text, extra);
  }

  answerCbQuery(): void {
    /* no-op in mock */
  }
}

/* Keyboard (reply keyboard) */
export class Keyboard {
  _rows: KeyboardButton[][] = [];
  _cur: KeyboardButton[] = [];
  _one = false;
  _rsz = false;

  text(label: string): this {
    this._cur.push({ text: label, type: "reply" });
    return this;
  }

  row(): this {
    if (this._cur.length) {
      this._rows.push(this._cur);
      this._cur = [];
    }
    return this;
  }

  oneTime(): this {
    this._one = true;
    return this;
  }

  resized(): this {
    this._rsz = true;
    return this;
  }

  build(): BuiltMarkup {
    if (this._cur.length) {
      this._rows.push(this._cur);
      this._cur = [];
    }
    return { type: "reply_keyboard", rows: this._rows.slice() };
  }
}

/* InlineKeyboard */
export class InlineKeyboard {
  _rows: KeyboardButton[][] = [];
  _cur: KeyboardButton[] = [];

  text(label: string, data?: string): this {
    this._cur.push({
      text: label,
      callback_data: data || label,
      type: "callback",
    });
    return this;
  }

  url(label: string, href: string): this {
    this._cur.push({ text: label, url: href, type: "url" });
    return this;
  }

  row(): this {
    if (this._cur.length) {
      this._rows.push(this._cur);
      this._cur = [];
    }
    return this;
  }

  build(): BuiltMarkup {
    if (this._cur.length) {
      this._rows.push(this._cur);
      this._cur = [];
    }
    return { type: "inline_keyboard", rows: this._rows.slice() };
  }
}

/* Bot */
export class Bot {
  token: string;
  _cmds: Record<string, Handler> = {};
  _actions: Record<string, Handler> = {};
  _hears: HearsEntry[] = [];
  _onMsg: Handler | null = null;
  _adapter: MockAdapter | null = null;

  constructor(opts?: { token?: string }) {
    this.token = opts?.token || "mock";
  }

  command(name: string, handler: Handler): this {
    this._cmds[name] = handler;
    return this;
  }

  on(event: string, handler: Handler): this {
    if (event === "message" || event === "message:text") {
      this._onMsg = handler;
    }
    return this;
  }

  action(pattern: string, handler: Handler): this {
    this._actions[pattern] = handler;
    return this;
  }

  hears(pattern: string | RegExp, handler: Handler): this {
    this._hears.push({ pattern, handler });
    return this;
  }

  launch(): void {
    if (this._adapter) this._adapter._boot(this);
  }

  start(): void {
    this.launch();
  }
}

/* MockAdapter */
export class MockAdapter {
  bot: Bot | null = null;
  private onOutput: (output: ChatOutput) => void;

  constructor(onOutput: (output: ChatOutput) => void) {
    this.onOutput = onOutput;
  }

  _boot(bot: Bot): void {
    this.bot = bot;
    if (bot._cmds["start"]) {
      const ctx = new Context(this, { message: { text: "/start" } });
      bot._cmds["start"](ctx);
    }
  }

  _send(text: string, extra?: Extra): void {
    const buttons: KeyboardButton[][] = [];

    if (extra?.reply_markup) {
      let mk = extra.reply_markup;
      if ("build" in mk && typeof mk.build === "function") {
        mk = mk.build();
      }
      if ("rows" in mk && mk.rows) {
        for (const row of mk.rows) {
          buttons.push(row);
        }
      }
    }

    this.onOutput({
      type: "bot",
      text: String(text),
      buttons: buttons.length > 0 ? buttons : undefined,
    });
  }

  clickButton(btn: KeyboardButton): void {
    this.onOutput({ type: "user", text: btn.text });

    if (btn.type === "callback") {
      const handler =
        this.bot?._actions[btn.callback_data!] ??
        this.bot?._cmds[btn.callback_data!];
      if (handler) {
        const ctx = new Context(this, {
          message: { text: btn.text },
          callback_query: { data: btn.callback_data! },
          match: btn.callback_data!,
        });
        handler(ctx);
      }
    } else if (btn.type === "reply") {
      this.dispatchText(btn.text);
    } else if (btn.type === "url") {
      this._send("Opening: " + btn.url);
    }
  }

  dispatchText(text: string): void {
    if (!this.bot) return;

    if (text.startsWith("/")) {
      const cmd = text.slice(1).split(" ")[0];
      if (this.bot._cmds[cmd]) {
        this.bot._cmds[cmd](
          new Context(this, { message: { text } }),
        );
        return;
      }
    }

    for (const h of this.bot._hears) {
      let match: RegExpMatchArray | string[] | null = null;
      if (h.pattern instanceof RegExp) {
        match = text.match(h.pattern);
      } else if (
        typeof h.pattern === "string" &&
        text.toLowerCase().indexOf(h.pattern.toLowerCase()) >= 0
      ) {
        match = [text];
      }
      if (match) {
        h.handler(
          new Context(this, { message: { text }, match: text }),
        );
        return;
      }
    }

    if (this.bot._onMsg) {
      this.bot._onMsg(
        new Context(this, { message: { text } }),
      );
      return;
    }

    this._send("No handler for this message.");
  }
}
