'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Users'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
      await queryInterface.bulkInsert(options, [
        {
          username: 'Bukayo-7',
          email: 'bukayo_saka@user.io',
          hashedPassword: bcrypt.hashSync('password'),
          firstName: 'Bukayo',
          lastName: 'Saka'
        },
        {
          username: 'Declan-41',
          email: 'declan_rice@user.io',
          hashedPassword: bcrypt.hashSync('password2'),
          firstName: 'Declan',
          lastName: 'Rice'
        },
        {
          username: 'William-2',
          email: 'william_saliba@user.io',
          hashedPassword: bcrypt.hashSync('password3'),
          firstName: 'William',
          lastName: 'Saliba'
        },

      ], {}) //{ validate: true } <-- maybe include validations
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users'
    const Op = Sequelize.Op

    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [
        'Bukayo-7', 'Declan-41', 'William-2'
      ]}
    }, {})
  }
};
