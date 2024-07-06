const ConfigTemplate = (env) => `
{
    "${env.ENVIRONMENT ?? 'development'}" : {
        "username": "${env.DATABASE_USER}",
        "password": "${env.DATABASE_PASSWORD}",
        "database": "${env.DATABASE_DB}",
        "host": "${env.DATABASE_HOST}",
        "dialect": "mysql"
    }
}
`;

class SequelizeCliHelper {

    static createDBConfig () {

        const fs = require("fs");
        require("dotenv").config();
        let existingConfig;
        const configData = ConfigTemplate(process.env);
        const directory = "config";
        const fileName = "config.json";
        const configFilePath = `${appRoot}/${directory}/${fileName}`; 

        // Create directory of it doesn't exist
        fs.mkdir(`${appRoot}/${directory}`,  (err) => void(0));
        try{
            existingConfig = fs.readFileSync(configFilePath);
        }catch(err){}
        if (!existingConfig || existingConfig.toString() !== configData ){
            //Write config
            // fs.writeFile(configFilePath, configData, (err) => {
            //     console.log(err)
            // })
        }

    }
}

module.exports = SequelizeCliHelper;