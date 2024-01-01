'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'ReviewImages'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 3,
        url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fhips.hearstapps.com%2Felledecor%2Fassets%2F16%2F49%2F1481050799-somerleyton-hall-living-room.jpg&tbnid=nG5kLVGPLJWEWM&vet=12ahUKEwj4qfb2_LqDAxVXOGIAHYGECEEQMygCegQIARBT..i&imgrefurl=https%3A%2F%2Fwww.elledecor.com%2Fdesign-decorate%2Fhouse-interiors%2Fa9396%2Fenglish-estate%2F&docid=u8Bx1hjZfxms1M&w=3336&h=2500&q=english%20mansion%20interior&ved=2ahUKEwj4qfb2_LqDAxVXOGIAHYGECEEQMygCegQIARBT'
      },
      {
        reviewId: 5,
        url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F157382910%2Fphoto%2Fold-english-manor-house.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DLD1_sjxIR_EaahEvDbbC_0z6Z26vfjkyZV4DbXno0XY%3D&tbnid=2tnL_YCo9NxkUM&vet=12ahUKEwjs1Omp_bqDAxUsOWIAHWfGD98QMygBegQIARA1..i&imgrefurl=https%3A%2F%2Fwww.istockphoto.com%2Fphoto%2Fold-english-manor-house-gm157382910-7307865&docid=aFZYz8lJBY_9XM&w=612&h=406&q=english%20mansion%20gate&ved=2ahUKEwjs1Omp_bqDAxUsOWIAHWfGD98QMygBegQIARA1'
      }
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
