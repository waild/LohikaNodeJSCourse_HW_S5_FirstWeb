const reservationRepo = require('../repositories/reservationRepo');
const reservationService = require('../services/reservationsService');

class Reservations {
    static createReservation(req, res) {
        reservationService
            .create(req.body.reservation)
            .then((data) => {
                res.sendStatus(201);
            }).catch(function (reason) {
                res.sendStatus(400);
            });
    }

    static getReservationInfo(req, res) {
        reservationService
            .getInfo(req.params.reservation_id)
            .then((data) => {
                if (data) {
                    res.json(data);
                } else {
                    res.sendStatus(404);
                }
            }).catch(function (reason) {
                res.sendStatus(400);
            });
    }

    static updateReservation(req, res) {
        reservationService
            .update(req.params.reservation_id, req.body.reservation)
            .then(() => {
                res.sendStatus(201);
            }).catch(function (reason) {
                res.sendStatus(400);
            });
    }

    static deleteReservation(req, res) {
        reservationService
            .delete(req.params.reservation_id)
            .then((status) => {
                if (status > 0) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
            }).catch(function (reason) {
                res.sendStatus(400);
            });
    }
}

module.exports = Reservations;