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
        lng: -0.1920772573974035,
        name: 'Horizons Court',
        description: '4-bedroom, chic home',
        price: 2000.00
      },
      {
        ownerId: 1,
        address: '6 Merton Lane',
        city: 'London',
        state: 'England',
        country: 'UK',
        lat: 51.56809520081582,
        lng: -0.15570343140771295,
        name: 'Heathfield House',
        description: 'Grand, a modern castle',
        price: 16000.00
      },
      {
        ownerId: 2,
        address: '7 Bishop Avenue',
        city: 'London',
        state: 'England',
        country: 'UK',
        lat: 51.57961857938635,
        lng: -0.1692165698011458,
        name: 'Edwardian Family Home',
        description: 'Mansion of red brick',
        price: 12000.00
      },
      {
        ownerId: 2,
        address: '3 Wadham Gardens',
        city: 'London',
        state: 'England',
        country: 'UK',
        lat: 51.54105530154114,
        lng: -0.16779377404736043,
        name: 'Muy Fancy Brick House',
        description: 'Boho-fancy, red-brick home',
        price: 10000.00
      },
      {
        ownerId: 3,
        address: '2 Gloucester Gate',
        city: 'London',
        state: 'England',
        country: 'UK',
        lat: 51.53495645156132,
        lng: -0.14761274521201334,
        name: 'Pish Posh Condo',
        description: '6-floor condo in a classical Nash residence',
        price: 10000.00
      },
      {
        ownerId: 3,
        address: '32 Argyle Street',
        city: 'London',
        state: 'England',
        country: 'UK',
        lat: 51.52902613857577,
        lng: -0.1235802163767059,
        name: 'Charming flat',
        description: 'Spacious yet cozy flat',
        price: 3000.00
      },

    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op

    return queryInterface.bulkDelete(options, {
      city: { [Op.in]: [
        'London'
      ]}
    }, {})
  }
};
