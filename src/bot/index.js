const Bot = require('../lib/Bot');
const handlers = require('./event_handlers');

let bot = new Bot();

bot.onEvent = function(session, message) {
  switch(message.type) {
    case 'Init':
      new handlers.Init(this, session, message);
      break;
    case 'InitRequest':
      new handlers.InitRequest(this, session, message);
      break;
    case 'Message':
      new handlers.Message(this, session, message);
      break;
    case 'Command':
      handlers.onCommand(session, message);
      break;
    case 'Payment':
      handlers.onPayment(session, message);
      break;
    case 'PaymentRequest':
      new handlers.PaymentRequest(this, session, message);
      break;
  }
}
