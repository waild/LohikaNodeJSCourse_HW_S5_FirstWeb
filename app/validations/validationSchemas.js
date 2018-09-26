
module.exports = {
  reservationSchema: {
    type: 'object',
    properties: {
      guests: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
      },
      time: {
        type: 'string',
        format: 'date-time',
      },
      duration: {
        type: 'number',
        minimum: 0.5,
        maximum: 6,
      },
    },
  },
  orderSchema: {
    type: 'object',
    properties: {
      meals: {
        type: 'array',
        minItems: 1,
        items: { type: 'string' },
      },
    },
  },
};
