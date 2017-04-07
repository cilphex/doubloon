const SOFA = require('sofa-js');
const Big = require('big.js');
const Fiat = require('../../lib/Fiat');
const help = require('./help_handler');

const teaseIcons = ['😈'];

function teaseIcon() {
  return teaseIcons[Math.floor(Math.random() * teaseIcons.length)];
}

function doubleUp(session, message) {
  let requestAmount = session.get('last_loss_value');
  session.reply(`That's what I like to see. ${teaseIcon()}`);

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

function betRandom(session, message) {
  const amount = Math.ceil(Math.random() * 7) + 3;

  Fiat.fetch(0).then((toEth) => {
    let requestAmount = toEth.USD(amount);
    session.reply(`YOLO`);
    // session.reply(SOFA.Message({
    //   attachments: [
    //     {
    //       type: 'image/gif',
    //       url: 'attachments/yolo-1.gif',
    //     }
    //   ]
    // }))
    session.requestEth(requestAmount);
  });
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
    case 'play':
    case 'play-again':
      playAgain(session, message);
      break;
    case 'bet-amount':
      betAmount(session, message);
      break;
    case 'bet-random':
      betRandom(session, message);
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
