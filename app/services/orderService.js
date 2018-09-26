const Ajv = require('ajv');
const reservationRepo = require('../repositories/reservationRepo');
const orderServiceClient = require('../clients/orderServiceClient');
const NotFoundError = require('../infrastracture/customErrors/notFoundError');

const ajv = new Ajv();

const { orderSchema } = require('../validations/validationSchemas');

const map = (reservation) => {
  const end = new Date(reservation.time);
  end.setSeconds(end.getSeconds() + reservation.duration * 60 * 60);
  return {
    start: new Date(reservation.time),
    end,
    guests: reservation.guests,
  };
};

const isOrderValid = order => ajv.validate(orderSchema, order);

class ReservationsService {
  static async createOrder(reservationId, orderRequest) {
    if (!isOrderValid(orderRequest)) {
      return Promise.reject(new Error('Data is not valid'));
    }
    const reservation = await reservationRepo.getInfo(reservationId);
    if (reservation) {
      if (reservation.orderUri) {
        return Promise.reject(new Error('Order already created'));
      }
      const location = await orderServiceClient.create(orderRequest);
      return reservationRepo.updateOrderUri(reservationId, location);
    }
    return Promise.reject(new NotFoundError('ReservationId was not found'));
  }

  static async getOrder(reservationId) {
    const reservation = await reservationRepo.getInfo(reservationId);
    if (reservation) {
      if (reservation.orderUri) {
        return orderServiceClient.get(reservation.orderUri);
      }
      return Promise.reject(new NotFoundError('Orders was not found'));
    }
    return Promise.reject(new NotFoundError('Reservation was not found'));
  }
}

module.exports = ReservationsService;
