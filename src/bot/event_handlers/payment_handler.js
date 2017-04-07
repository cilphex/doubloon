const SOFA = require('sofa-js');
const Big = require('big.js');
const History = require('../../lib/History');

const winIcons = ['🎉', '🤑', '💸', '🍻', '⭐'];
const loseIcons = ['😞', '😢', '😭', '😰', '🤢', '😱'];

const bettingTexts = [
  'Rolling the dice... 🎲',
  'Studying the stars... ✨',
  'Whispering to the willows... 🍃',
  'Reading the rainbows... 🌈',
  'Consulting the crystal... 🔮',
  'Cutting the custard... 🍮',
  'Pulling levers... 🎰'
];

function winIcon() {
  return winIcons[Math.floor(Math.random() * winIcons.length)];
}

function loseIcon() {
  return loseIcons[Math.floor(Math.random() * winIcons.length)];
}

function bettingText() {
  return bettingTexts[Math.floor(Math.random() * bettingTexts.length)];
}

function win(session, message) {
  const { ethValue } = message;
  const payoutValue = parseFloat(Big(ethValue).mul(2));
  History.pushWin(payoutValue);

  session.reply(`You win! ${winIcon()}`);
  session.sendEth(payoutValue, function(session, err, result) {
    if (err) {
      session.reply(`There was an error! "${err.message}." I might be out of money...`);
    }

    session.reply(SOFA.Message({
      body: `Play again?`,
      controls: [
        {type: "button", label: "$1", value: 1},
        {type: "button", label: "$2", value: 2},
        {type: "button", label: "$3", value: 3},
        {type: "button", label: "🎲", value: 'bet-random'},
      ]
    }));
  });
}

function lose(session, message) {
  const { ethValue } = message;
  History.pushLoss(ethValue);

  session.set('last_loss_value', ethValue);
  session.reply(SOFA.Message({
    body: `Rats, you lost! ${loseIcon()}`,
    controls: [
      {type: "button", label: "Play again", value: "play-again"},
      {type: "button", label: "Double up", value: "double-up"},
      {type: "button", label: "Prove it", value: "help-prove-loss"},
    ]
  }));
}

function winOrLose(session, message) {
  const txHash = session.get('last_tx_hash');

  if (!txHash) {
    return session.reply('The tx hash is missing!');
  }

  const part = txHash.substr(0, 10);
  const number = parseInt(part);
  const remainder = Big(number).mod(100);

  remainder.lt(50)
    ? lose(session, message)
    : win(session, message);
}

module.exports = function(session, message) {
  const { txHash, ethValue } = message;
  const val = Big(ethValue);

  session.set('last_tx_hash', txHash);

  if (val.gt(1)) {
    session.reply('The max bet is 1 ETH. Have this back.');
    session.sendEth(parseFloat(val), function(session, err, result) {
      // TODO (Craig): Handle error
    });
    return;
  }

  session.reply(bettingText());
  setTimeout(winOrLose.bind(this, session, message), 2500);
}
