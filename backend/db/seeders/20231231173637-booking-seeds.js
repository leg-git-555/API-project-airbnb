'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Bookings'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: new Date(2024, 4, 20), //maybe add .toString()
        endDate: new Date(2024, 4, 27)
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date(2024, 5, 20), 
        endDate: new Date(2024, 5, 27)
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date(2024, 5, 10),
        endDate: new Date(2024, 5, 17)
      },
      {
        spotId: 4,
        userId: 3,
        startDate: new Date(2024, 4, 10),
        endDate: new Date(2024, 4, 13)
      },
      {
        spotId: 5,
        userId: 2,
        startDate: new Date(2024, 7, 4),
        endDate: new Date(2024, 7, 16)
      },
      {
        spotId: 6,
        userId: 1,
        startDate: new Date(2024, 6, 14),
        endDate: new Date(2024, 6, 16)
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    const Op = Sequelize.Op

    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [
        1, 2, 3
      ]}
    }, {})
  }
};
