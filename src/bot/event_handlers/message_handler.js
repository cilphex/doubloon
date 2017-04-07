const SOFA = require('sofa-js');
const Fiat = require('../../lib/Fiat');
const help = require('./help_handler');

function play(session, message) {
  session.reply(SOFA.Message({
    body: `Let's play!`,
    controls: [
      {type: "button", label: "$1", value: 1},
      {type: "button", label: "$2", value: 2},
      {type: "button", label: "$3", value: 3},
      {type: "button", label: "🎲", value: 'bet-random'},
    ]
  }));
}

module.exports = function(session, message) {
  const { body } = message.content;

  if (!body) {
    session.reply('🖼 👀 🆒');
    play(session, message);
    return;
  }

  const keyword = body.toLowerCase();
  switch (keyword) {
    case 'help':
      help(session, message);
      break;
    default:
      play(session, message);
      break;
  }
}
