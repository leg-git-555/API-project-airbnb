'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'SpotImages'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Watch_Mercury_Spin_on_its_Axis_%28hd_video%29_%288497927473%29.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Venus_globe.jpg/2048px-Venus_globe.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/640px-OSIRIS_Mars_true_color.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Jupiter.jpg/600px-Jupiter.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Saturn_%28planet%29_large.jpg/387px-Saturn_%28planet%29_large.jpg?20150823045304',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Neptune.jpg/640px-Neptune.jpg',
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    const Op = Sequelize.Op

    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: [
        true
      ]}
    }, {})
  }
};
