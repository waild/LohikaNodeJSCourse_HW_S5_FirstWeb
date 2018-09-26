const rpm = require('../infrastracture/request-promise-manager');
const { orderServiceUrl } = require('../configuration');

class OrderClient {
  static async create(orderData) {
    const fullResponse = await rpm.postJson(`${orderServiceUrl}/api/orders`, orderData);
    if (fullResponse.statusCode === 201) {
      return fullResponse.headers.location;
    }
    return new Error(fullResponse.statusMessage);
  }

  static get(orderUri) {
    if (typeof orderUri !== 'string' || !orderUri) {
      throw new Error('Wrong param type, param name: orderUri');
    }
    return rpm.getJson(`${orderServiceUrl}${orderUri}`);
  }
}

module.exports = OrderClient;
