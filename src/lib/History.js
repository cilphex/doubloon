const Big = require('big.js');
const TextFormatter = require('./TextFormatter');

const MAX_HISTORY_LENGTH = 10;

class History {
  constructor() {
    this.history = [];
  }

  toString() {
    if (this.history.length <= 0) {
      return 'No bets have been placed yet!'
    }

    let text = this.history
      .map(item => {
        const w = item.win ? 'WON' : 'LOST';
        const a = Big(item.amount).toFixed(2);
        return `${w} ${a} ETH`;
      })
      .join('\n');

    return TextFormatter.format(text);
  }

  push(amount, win, date) {
    this.history.push({ amount, win, date });

    while(this.history.length > MAX_HISTORY_LENGTH) {
      this.pop();
    }
  }

  pop() {
    return this.history.pop();
  }

  pushWin(amount) {
    this.push(amount, true, Date.now());
  }

  pushLoss(amount) {
    this.push(amount, false, Date.now());
  }
}

module.exports = new History;
