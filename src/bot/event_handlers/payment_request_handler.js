const Handler = require('./handler');
const SOFA = require('sofa-js');

module.exports = class PaymentRequestHandler extends Handler {
  reply() {
    this.session.reply(`Sorry, that's not how we play. 😘`);

    setTimeout(() => {
      this.session.reply(SOFA.Message({
        body: `Let's go!`,
        controls: [
          {type: "button", label: "$1", value: 1},
          {type: "button", label: "$2", value: 2},
          {type: "button", label: "$3", value: 3},
          {type: "button", label: "🎲", value: 'bet-random'},
        ]
      }));
    }, 1500);
  }
}
