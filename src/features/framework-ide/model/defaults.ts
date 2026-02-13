export const DEFAULT_CODE = `import { Bot, InlineKeyboard } from '@scibot/sdk';

const bot = new Bot({ token: process.env.BOT_TOKEN });

bot.command('start', (ctx) => {
  ctx.reply('Welcome to SCI-LAB!\\nChoose a module to explore:', {
    reply_markup: new InlineKeyboard()
      .text('FlowSpec Engine', 'flowspec')
      .text('MCU Emulator', 'mcu')
      .row()
      .text('Workspace', 'workspace')
      .text('Stats', 'stats')
  });
});

bot.action('flowspec', (ctx) => {
  ctx.reply('FlowSpec v3.2.1\\nDSL-driven bot infrastructure\\nCompiler + Runtime + Hot-reload', {
    reply_markup: new InlineKeyboard()
      .text('Deploy Now', 'deploy')
      .row()
      .text('Back', 'start')
  });
});

bot.action('mcu', (ctx) => {
  ctx.reply('MCU Emulator Core\\nCycle-accurate simulation\\n8-bit arch, 256B RAM', {
    reply_markup: new InlineKeyboard()
      .text('Run Emulator', 'deploy')
      .row()
      .text('Back', 'start')
  });
});

bot.action('workspace', (ctx) => {
  ctx.reply('Distributed Workspace v2.0\\nCRDT sync + Event sourcing', {
    reply_markup: new InlineKeyboard()
      .text('Open Workspace', 'deploy')
      .row()
      .text('Back', 'start')
  });
});

bot.action('stats', (ctx) => {
  ctx.reply('Platform Stats:\\n\\nActive sessions: 42\\nDeployed bots: 128\\nUptime: 99.9%', {
    reply_markup: new InlineKeyboard()
      .text('Refresh', 'stats')
      .text('Back', 'start')
  });
});

bot.action('deploy', (ctx) => {
  ctx.reply('Deploying to staging...\\nWorker pool: 4 instances\\nStatus: healthy', {
    reply_markup: new InlineKeyboard()
      .text('Restart', 'start')
  });
});

bot.on('message', (ctx) => {
  ctx.reply('Echo: ' + ctx.message.text +
    '\\nType /start to return to menu.');
});

bot.launch();`;
