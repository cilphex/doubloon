const SOFA = require('sofa-js');

function help(session, message) {
  session.reply(SOFA.Message({
    body: `Sure, what can I help you with?`,
    controls: [
      {type: "button", label: `Rules of the game`, value: 'help-rules'},
      {type: "button", label: `Recent wins`, value: 'help-history'},
    ]
  }));
}

function helpRules(session, message) {
  session.reply(`Good luck!`);
}

function helpHistory(session, message) {
  session.reply(`This'll come eventually.`);
}

function unknown(session, message) {
  session.reply(`That's an unkown help command.`);
}

module.exports = function(session, message) {
  const { body, value } = message.content;
  let command = value;

  if (!command) {
    command = body.toLowerCase();
  }

  switch (command) {
    case 'help':
      help(session, message);
      break;
    case 'help-rules':
      helpRules(session, message);
      break;
    case 'help-history':
      helpHistory(session, message);
      break;
    default:
      unknown(session, message);
      break;
  }
}
