const InitHandler = require('./init_handler');
const InitRequestHandler = require('./init_request_handler');
const commandHandler = require('./command_handler');
const MessageHandler = require('./message_handler');
const paymentHandler = require('./payment_handler');
const PaymentRequestHandler = require('./payment_request_handler');

module.exports = {
  Init: InitHandler,
  InitRequest: InitRequestHandler,
  onCommand: commandHandler,
  Message: MessageHandler,
  onPayment: paymentHandler,
  PaymentRequest: PaymentRequestHandler,
}
