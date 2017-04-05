const initHandler = require('./init_handler');
const initRequestHandler = require('./init_request_handler');
const commandHandler = require('./command_handler');
const messageHandler = require('./message_handler');
const paymentHandler = require('./payment_handler');
const paymentRequestHandler = require('./payment_request_handler');

module.exports = {
  onInit: initHandler,
  onInitRequest: initRequestHandler,
  onCommand: commandHandler,
  onMessage: messageHandler,
  onPayment: paymentHandler,
  onPaymentRequest: paymentRequestHandler,
}
