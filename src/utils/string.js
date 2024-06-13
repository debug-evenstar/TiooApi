let inflection = require("inflection");

module.exports = {
    capitalize : (string)=>{
        return string[0].toUpperCase() + string.substring(1);
    },
    singularize : (string) => {
        return inflection.singularize(string);
    }
};