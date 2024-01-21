'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Spots'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1 Horizons Court, NW3 7th',
        city: 'London',
        state: 'England',
        country: 'UK',
        lat: 51.56340207838962,
        lng: -1.1920772573974035,
        name: 'Mercury Launch Point',
        description: 'Launch to Mercury from here!',
        price: 2000.00
      },
      {
        ownerId: 1,
        address: '6 Merton Lane',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA',
        lat: 52.56809520081582,
        lng: -2.15570343140771295,
        name: 'Venus Launch Point',
        description: 'Launch to Venus from our basement!',
        price: 16000.00
      },
      {
        ownerId: 2,
        address: '7 Bishop Avenue',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'USA',
        lat: 53.57961857938635,
        lng: -3.1692165698011458,
        name: 'Mars Launch Point',
        description: 'martian ufo boarding via bedroom',
        price: 12000.00
      },
      {
        ownerId: 2,
        address: '3 Wadham Gardens',
        city: 'Mexico City',
        state: 'DF',
        country: 'Mexico',
        lat: 54.54105530154114,
        lng: -4.16779377404736043,
        name: 'Jupiter Launch Point',
        description: 'Jupiter portal in the garage!',
        price: 10000.00
      },
      {
        ownerId: 3,
        address: '2 Gloucester Gate',
        city: 'Charlotte',
        state: 'NC',
        country: 'USA',
        lat: 55.53495645156132,
        lng: -5.14761274521201334,
        name: 'Saturn Launch Point',
        description: 'Posh slingshot to saturn on roof!',
        price: 10000.00
      },
      {
        ownerId: 3,
        address: '32 Argyle Street',
        city: 'Tampa',
        state: 'FL',
        country: 'UK',
        lat: 56.52902613857577,
        lng: -6.1235802163767059,
        name: 'Neptune Launch Point',
        description: 'Go to neptune via infinity pool',
        price: 3000.00
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op

    return queryInterface.bulkDelete(options, {
      state: { [Op.in]: [
        'England'
      ]}
    }, {})
  }
};
