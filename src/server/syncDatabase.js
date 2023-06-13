const { db } = require("../database/connection");


//=============== RE-INITIALIZE DATABASE ================//
db.sequelize.sync({force: true})
    .then(() => {
        console.log('Database schema synchronized.');
    })
    .catch((err) => {
        console.error('Error synchronizing database:', error);
    });