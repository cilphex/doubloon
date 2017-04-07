const Handler = require('./handler');

module.exports = class InitHandler extends Handler {
  reply() {
    this.session.reply('Init response');
  }
}
