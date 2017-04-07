const Handler = require('./handler');

module.exports = class InitRequestHandler extends Handler {
  reply() {
    this.session.reply('InitRequest response');
  }
}
