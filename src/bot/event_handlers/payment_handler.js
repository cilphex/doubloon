const SOFA = require('sofa-js');
const Big = require('big.js');
const Fiat = require('../../lib/Fiat');

function win(session, message) {
  const { ethValue } = message;
  const payoutValue = parseFloat(Big(ethValue).mul(2));

  session.reply('You win! 🎉');
  session.sendEth(payoutValue, function(session, err, result) {
    if (err) {
      // TODO (Craig): Actually handle the error
      console.log('err.message', err.message);
      console.log('err.stack', err.stack);
    }

    let amounts = [1];
    const controls = [];

    Fiat.fetch(0).then((toEth) => {
      const threshold = toEth.USD(3);

      if (payoutValue > threshold) {
        amounts = amounts.concat([4, 8]);
      }
      else {
        amounts = amounts.concat([2, 3]);
      }

      amounts.forEach((amount) => controls.push({
        type: "button", label: `$${amount}`, value: amount
      }));

      session.reply(SOFA.Message({
        body: 'Play again?',
        controls: controls
      }));
    });
  });
}

function lose(session, message) {
  const { ethValue } = message;
  session.set('last_loss_value', ethValue);
  session.reply(SOFA.Message({
    body: `Rats, you lost! 😭`,
    controls: [
      {type: "button", label: "Play again", value: "play-again"},
      {type: "button", label: "Double up", value: "double-up"},
      {type: "button", label: "Prove it", value: "prove-loss"},
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

  remainder.lt(48)
    ? win(session, message)
    : lose(session, message);
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

  session.reply('Rolling the dice... 🎲');
  setTimeout(winOrLose.bind(this, session, message), 2500);
}



// example ethereum tx hash:
// 0xed973b234cf2238052c9ac87072c71bcf33abc1bbd721018e0cca448ef79b379
