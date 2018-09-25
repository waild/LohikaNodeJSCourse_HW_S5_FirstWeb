const Ajv = require('ajv');
const reservationRepo = require('../repositories/reservationRepo');
const NotFoundError = require('../infrastracture/customErrors/notFoundError');

const ajv = new Ajv();

const { reservationSchema } = require('../validations/validationSchemas');

const map = (reservation) => {
  const end = new Date(reservation.time);
  end.setSeconds(end.getSeconds() + reservation.duration * 60 * 60);
  return {
    start: new Date(reservation.time),
    end,
    guests: reservation.guests,
  };
};

const isReservationValid = reservation => ajv.validate(reservationSchema, reservation);

class ReservationsService {
  static async update(id, reservationRequest) {
    if (!isReservationValid(reservationRequest)) {
      return Promise.reject(new Error('Data is not valid'));
    }
    const reservation = map(reservationRequest);
    const freeTables = await reservationRepo
      .getFreeTablesForPeriodExceptCurrent(reservation.start, reservation.end, id);
    const smalestAvailableTable = freeTables
      .find(value => value.capacity >= reservationRequest.guests);
    if (smalestAvailableTable) {
      reservation.table_id = smalestAvailableTable.id;
      return reservationRepo.update(id, reservation);
    }
    return Promise.reject(new NotFoundError('No available table'));
  }

  static async create(reservationRequest) {
    if (!isReservationValid(reservationRequest)) {
      return Promise.reject(new Error('Data is not valid'));
    }
    const reservation = map(reservationRequest);
    const freeTables = await reservationRepo
      .getFreeTablesForPeriod(reservation.start, reservation.end);
    const smalestAvailableTable = freeTables
      .find(value => value.capacity >= reservationRequest.guests);
    if (smalestAvailableTable) {
      reservation.table_id = smalestAvailableTable.id;
      return reservationRepo.create(reservation);
    }
    return Promise.reject(new NotFoundError('No available table'));
  }

  static async getInfo(id) {
    const reservation = await reservationRepo.getInfo(id);
    if (reservation) {
      return {
        reservation: {
          id,
          guests: reservation.guests,
          start: reservation.start,
          end: reservation.end,
          table: {
            number: reservation.number,
            capacity: reservation.capacity,
          },
        },
      };
    }
    return null;
  }

  static delete(id) {
    return reservationRepo.delete(id);
  }
}

module.exports = ReservationsService;
