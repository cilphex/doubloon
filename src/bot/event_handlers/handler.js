module.exports = class Handler {
  constructor(bot, session, message) {
    this.bot = bot;
    this.session = session;
    this.message = message;

    this.reply();
  }

  reply() {
    const className = this.constructor.name;
    this.session.reply(`Reply function not implemented for ${className}`);
  }
}
