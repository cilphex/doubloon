const SOFA = require('sofa-js');
const Big = require('big.js');
const Fiat = require('../../lib/Fiat');
const help = require('./help_handler');

function doubleUp(session, message) {
  let requestAmount = session.get('last_loss_value');
  session.reply(`That's what I like to see. 😈`);

  if (requestAmount) {
    requestAmount = parseFloat(Big(requestAmount).mul(2));
    return session.requestEth(requestAmount);
  }

  Fiat.fetch(0).then((toEth) => {
    requestAmount = toEth.USD(1);
    session.requestEth(requestAmount);
  });
}

function playAgain(session, message) {
  session.reply(`I like your style. Let's go!`);
  Fiat.fetch(0).then((toEth) => {
    let requestAmount = toEth.USD(1);
    session.requestEth(requestAmount);
  });
}

function betAmount(session, message) {
  const amount = message.content.value;

  session.reply(`Here we go!`);
  Fiat.fetch(0).then((toEth) => {
    let requestAmount = toEth.USD(amount);
    session.requestEth(requestAmount);
  });
}

function proveLoss(session, message) {
  const txHash = session.get('last_tx_hash');

  if (!txHash) {
    session.reply(`You haven't bet yet.`);
  }

  const part = txHash.substr(0, 10);
  const number = parseInt(part);
  const remainder = Big(number).mod(100);
  let replyText = `
    Your last payment to me had a transaction hash starting with ${part}.
    When cast to an integer, its value is ${number}. ${number} % 100 is
    ${remainder}. ${remainder} is greater than 48, so you lose.
  `;

  replyText = replyText.trim().replace(/\s+/g, ' ');

  session.reply(SOFA.Message({
    body: replyText,
    controls: [
      {type: "button", label: `View tx`, value: 'view-last-tx'},
      {type: "button", label: `Double up`, value: 'double-up'},
      {type: "button", label: `Help`, value: 'help'},
    ]
  }));
}

function viewLastTx(session, message) {
  const txHash = session.get('last_tx_hash');
  const replyText = `Tx hash: ${txHash}`;
  session.reply(replyText);

  session.reply(SOFA.Message({
    body: replyText,
    controls: [
      {type: "button", label: `Play again`, value: 'play-again'},
      {type: "button", label: `Double up`, value: 'double-up'},
      {type: "button", label: `Help`, value: 'help'},
    ]
  }));
}

function badCommand(session, message) {
  session.reply(`Sorry, I didn't understand that command.`);
}

module.exports = function(session, message) {
  const { body, value } = message.content;
  let command = value;

  if (body.startsWith('$')) {
    command = 'bet-amount';
  }

  if (command.startsWith('help')) {
    command = 'help';
  }

  switch(command) {
    case 'double-up':
      doubleUp(session, message);
      break;
    case 'play-again':
      playAgain(session, message);
      break;
    case 'bet-amount':
      betAmount(session, message);
      break;
    case 'prove-loss':
      proveLoss(session, message);
      break;
    case 'view-last-tx':
      viewLastTx(session, message);
      break;
    case 'help':
      help(session, message);
      break;
    default:
      badCommand(session, message);
      break;
  }
}
