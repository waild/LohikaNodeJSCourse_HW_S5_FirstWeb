
exports.seed = function (knex, Promise) {
  return knex('reservations').del()
    .then(() => knex('reservations').insert([
      {
        id: 1, table_id: 1, start: new Date('2016-09-08 15:00:00.00000-06'), end: new Date('2016-09-08 16:00:00.00000-06'), guests: 2,
      },
    ]));
};
