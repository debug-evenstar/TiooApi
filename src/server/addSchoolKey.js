const { SchoolManagement, Keypairs } = require("../database/connection");
const { Op } = require('sequelize');
const crypto = require('crypto');
class AddKeys {
    static async addKeys() {
    
        const allSchools = await SchoolManagement.findAll({
            where: {
                '$Keypair.id$': {
                    [Op.eq]: null
                }
            },
            include: [
                {
                    model: Keypairs
                }
            ]
        });
       
        allSchools.forEach(async function(school) {
          
            const createKeypairs = await Keypairs.create({
                public_key: crypto.randomBytes(20).toString('base64'),
                private_key: crypto.randomBytes(20).toString('base64'),
            });
            await school.setKeypair(createKeypairs);
          

            console.log(`school: ${school}`);
        });
        console.log(allSchools)
    }
}
AddKeys.addKeys();