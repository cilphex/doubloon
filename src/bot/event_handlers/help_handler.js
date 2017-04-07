const SOFA = require('sofa-js');
const Big = require('big.js');
const History = require('../../lib/History');
const TextFormatter = require('../../lib/TextFormatter');

function helpControls() {
  return [
    {type: "button", label: `Game rules`, value: 'help-rules'},
    {type: "button", label: `Recent bets`, value: 'help-history'},
    {type: "button", label: `Play Now`, value: 'play'},
  ];
}

function help(session, message) {
  session.reply(SOFA.Message({
    body: `Sure, what can I help you with?`,
    controls: helpControls()
  }));
}

function helpRules(session, message) {
  let text = `
    Game rules:

    Send any amount of ETH to me. I will either send you back double \
    your money, or keep the whole thing. You have a 50% chance of \
    winning.

    Your win is derived directly from the transaction hash of the \
    payment that you send me. I'll take the first 10 characters of \
    that hash and cast it to an integer. Then I'll mod it by 100. \
    If the result is greater than or equal to 50, you win. Otherwise, \
    you lose.
  `;

  session.reply(SOFA.Message({
    body: TextFormatter.format(text),
    controls: helpControls(),
  }));
}

function helpProveLoss(session, message) {
  const txHash = session.get('last_tx_hash');

  if (!txHash) {
    session.reply(`You haven't bet yet.`);
  }

  const part = txHash.substr(0, 10);
  const number = parseInt(part);
  const remainder = Big(number).mod(100);

  let text = `
    Your last payment to me had a transaction hash starting with ${part}. \
    When cast to an integer, its value is ${number}. ${number} % 100 is \
    ${remainder}. ${remainder} is less than 50, so you lose. \
  `;

  text = TextFormatter.format(text);
  session.reply(SOFA.Message({
    body: text,
    controls: [
      {type: "button", label: `View tx`, value: 'view-last-tx'},
      {type: "button", label: `Double up`, value: 'double-up'},
      {type: "button", label: `Help`, value: 'help'},
    ]
  }));
}

function helpHistory(session, message) {
  session.reply(SOFA.Message({
    body: History.toString(),
    controls: helpControls(),
  }))
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
    case 'help-prove-loss':
      helpProveLoss(session, message);
      break;
    case 'help-history':
      helpHistory(session, message);
      break;
    default:
      unknown(session, message);
      break;
  }
}
