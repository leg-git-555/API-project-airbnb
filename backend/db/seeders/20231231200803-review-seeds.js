'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Reviews'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        review: 'The spot was clean, comfortable, and had a great location. Would definitely recommend!',
        stars: 5
      },
      {
        spotId: 1,
        userId: 3,
        review: 'The spot was nice, the host was responsive',
        stars: 4
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Wow! Lovely! The chef was amazing',
        stars: 5
      },
      {
        spotId: 4,
        userId: 3,
        review: 'Decor was amazing but dusty',
        stars: 3
      },
      {
        spotId: 5,
        userId: 1,
        review: 'I had to scale the gates to get in but after that, smooth sailing',
        stars: 2
      },
      {
        spotId: 6,
        userId: 2,
        review: 'The best bnb stay of my life. Already planning my next stay!',
        stars: 5
      },

    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op

    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [
        1, 2, 3
      ]}
    }, {})
  }
};
