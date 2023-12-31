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
        url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fc%2Fca%2FBelton_House_South_Elevation.jpg&tbnid=t8Yu3RQDBFyIRM&vet=12ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygAegQIARB0..i&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FEnglish_country_house&docid=df3wL0Dun9Rb6M&w=3108&h=1943&q=english%20mansion&ved=2ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygAegQIARB0',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages.mansionglobal.com%2F%2Fim-674964&tbnid=lBkFRV0xOGj1BM&vet=12ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygBegQIARB2..i&imgrefurl=https%3A%2F%2Fwww.mansionglobal.com%2Farticles%2Fenglish-country-manor-has-330-years-of-historyplus-a-pool-and-a-home-theater-01669673959&docid=V1dSGGq8NAFa8M&w=1280&h=959&q=english%20mansion&ved=2ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygBegQIARB2',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fs.wsj.net%2Fpublic%2Fresources%2Fimages%2FMN-AG983_PRIVPR_G_20140827171513.jpg&tbnid=c6q0krkt7R2SCM&vet=12ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygCegQIARB4..i&imgrefurl=https%3A%2F%2Fwww.wsj.com%2Farticles%2Fan-english-mansion-with-massive-basement-asks-29-million-1409179442&docid=fnFNpr35yzJEHM&w=553&h=369&q=english%20mansion&ved=2ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygCegQIARB4',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fmedia.cntraveler.com%2Fphotos%2F564df3e396771ce632e441ea%2Fmaster%2Fpass%2Fenglish-manors-Whatley-Manor-cr-courtesy.jpg&tbnid=cMV0EgOHaops2M&vet=12ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygDegQIARB6..i&imgrefurl=https%3A%2F%2Fwww.cntraveler.com%2Fgalleries%2F2015-11-19%2F10-best-english-manor-estates&docid=JHDasv5TGLIZIM&w=2048&h=1536&q=english%20mansion&ved=2ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygDegQIARB6',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.mansionglobal.com%2Fproduction%2Fmedia%2Farticle-images%2Fa64d4a63c4d18c03a6cf66f867e779a1%2Flarge_canonteignmanor25-05-1802_1_SMART.jpg&tbnid=k2FxexU4tmhASM&vet=12ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygFegQIARB-..i&imgrefurl=https%3A%2F%2Fwww.mansionglobal.com%2Farticles%2F400-year-old-english-manor-house-asks-almost-4-million-114478&docid=rNEfzXB0H-jdgM&w=1280&h=720&q=english%20mansion&ved=2ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygFegQIARB-',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fs.wsj.net%2Fpublic%2Fresources%2Fimages%2FBN-FQ461_hodwoo_M_20141120044105.jpg&tbnid=Hp4vhCX87576eM&vet=12ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygGegUIARCAAQ..i&imgrefurl=https%3A%2F%2Fwww.wsj.com%2Farticles%2Feurope-house-of-the-day-grand-english-mansion-photos-1416830644&docid=vbIYrHP3pxtw8M&w=1280&h=853&q=english%20mansion&ved=2ahUKEwiCgOLb4rqDAxU4GGIAHe9cDroQMygGegUIARCAAQ',
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
