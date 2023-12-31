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
        startDate: '2024-04-20',
        endDate: '2024-04-27' 
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2024-05-20', 
        endDate: '2024-05-27' 
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2024-05-10',
        endDate: '2024-05-17' 
      },
      {
        spotId: 4,
        userId: 3,
        startDate: '2024-04-10',
        endDate: '2024-04-13' 
      },
      {
        spotId: 5,
        userId: 2,
        startDate: '2024-07-4',
        endDate: '2024-07-16' 
      },
      {
        spotId: 6,
        userId: 1,
        startDate: '2024-06-14',
        endDate: '2024-06-16' 
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
