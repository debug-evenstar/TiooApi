let inflection = require("inflection");

module.exports = {
    capitalize : (string)=>{
        return string[0].toUpperCase() + string.substring(1);
    },
    singularize : (string) => {
        return inflection.singularize(string);
    },
    randomString : (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
};