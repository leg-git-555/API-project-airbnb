'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.addColumn('Users', 'firstName', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: false
        });

      await queryInterface.addColumn('Users', 'lastName', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: false
        });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
