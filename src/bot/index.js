const Bot = require('../lib/Bot');
const handlers = require('./event_handlers');

let bot = new Bot();

bot.onEvent = function(session, message) {
  switch(message.type) {
    case 'Init':
      handlers.onInit(session, message);
      break;
    case 'InitRequest':
      handlers.onInitRequest(session, message);
      break;
    case 'Message':
      handlers.onMessage(session, message);
      break;
    case 'Command':
      handlers.onCommand(session, message);
      break;
    case 'Payment':
      handlers.onPayment(session, message);
      break;
    case 'PaymentRequest':
      handlers.onPaymentRequest(session, message);
      break;
  }
}
