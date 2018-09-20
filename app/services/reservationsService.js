const reservationRepo = require('../repositories/reservationRepo');
const Ajv = require('ajv');
const ajv = new Ajv();

const reservationSchema = {
    'type': 'object',
    'properties': {
        'guests': {
            'type': 'integer',
            'minimum': 1,
            'maximum': 10
        },
        'time': {
            'type': 'string',
            'format': 'date-time',
            'duration': {
                'type': 'number',
                'minimum': 0.5,
                'maximum': 6
            }
        }
    }
};

const map = (reservation) => {
    let end = new Date(reservation.time);
    end.setSeconds(end.getSeconds() + reservation.duration * 60 * 60);
    return {
        'start': new Date(reservation.time),
        'end': end,
        'guests': reservation.guests
    };
}

const isReservationValid = (reservation) => {
    return ajv.validate(reservationSchema, reservation);
}

class ReservationsService {
    static async update(id, reservationRequest) {
        if (!isReservationValid(reservationRequest)) {
            return Promise.reject('Data is not valid');
        }
        const reservation = map(reservationRequest);
        const freeTables = await reservationRepo.getFreeTablesForPeriodExceptCurrent(reservation.start, reservation.end, id);
        var smalestAvailableTable = freeTables.find((value) => {
            return value.capacity >= reservationRequest.guests
        });
        if (smalestAvailableTable) {
            reservation['table_id'] = smalestAvailableTable.id;
            return reservationRepo.update(id, reservation);
        } else {
            return Promise.reject('No available table');
        }
    }
    static async create(reservationRequest) {
        if (!isReservationValid(reservationRequest)) {
            return Promise.reject('Data is not valid');
        }
        const reservation = map(reservationRequest);
        const freeTables = await reservationRepo.getFreeTablesForPeriod(reservation.start, reservation.end);
        var smalestAvailableTable = freeTables.find((value) => {
            return value.capacity >= reservationRequest.guests
        });
        if (smalestAvailableTable) {
            reservation['table_id'] = smalestAvailableTable.id;
            return reservationRepo.create(reservation);
        } else {
            return Promise.reject('No available table');
        }
    }
    static async getInfo(id) {

        var reservation = await reservationRepo.getInfo(id);
        if (!reservation) {
            return;
        }

        return {
            "reservation": {
                "id": id,
                "guests": reservation.guests,
                "start": reservation.start,
                "end": reservation.end,
                "table": {
                    "number": reservation.number,
                    "capacity": reservation.capacity
                }
            }
        };
    }
    static delete(id) {
        return reservationRepo.delete(id);
    }
}

module.exports = ReservationsService;