const { db } = require("../database/connection");


//=============== RE-INITIALIZE DATABASE ================//

class SyncDB {

    static async run(req, res) {

        db.sequelize.sync({force: true})
        .then(() => {
            console.log('Database schema synchronized.');
        })
        .catch((err) => {
            console.error({message: 'Error synchronizing database:', extra: err.message});
        });

    }
}

module.exports = SyncDB;