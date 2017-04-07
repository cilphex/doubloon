const Handler = require('./handler');
const SOFA = require('sofa-js');
const help = require('./help_handler');

module.exports = class MessageHandler extends Handler {
  reply() {
    const { body } = this.message.content;

    if (!body) {
      this.session.reply('🖼 👀 🆒');
      this.play();
      return;
    }

    const keyword = body.toLowerCase();
    switch (keyword) {
      case 'help':
        help(session, message);
        break;
      case 'ignore':
        break;
      default:
        this.play();
        break;
    }
  }

  play() {
    this.session.reply(SOFA.Message({
      body: `Let's play!`,
      controls: [
        {type: "button", label: "$1", value: 1},
        {type: "button", label: "$2", value: 2},
        {type: "button", label: "$3", value: 3},
        {type: "button", label: "🎲", value: 'bet-random'},
      ]
    }));
  }
}
