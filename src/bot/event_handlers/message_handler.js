const SOFA = require('sofa-js');
const Fiat = require('../../lib/Fiat');
const help = require('./help_handler');

function play(session, message) {
  session.reply(`Let's play!`);

  Fiat.fetch(0).then((toEth) => {
    let requestAmount = toEth.USD(1);
    session.requestEth(requestAmount);
  });
}

module.exports = function(session, message) {
  const keyword = message.content.body.toLowerCase();

  switch (keyword) {
    case 'help':
      help(session, message);
      break;
    default:
      play(session, message);
      break;
  }
}
