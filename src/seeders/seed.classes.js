const { Class } = require('../model/database/index');

const { Op } = require("sequelize");

const nursery_primary_secondary_grade = [
    { type: "nursery", naming: "lower kindergarten" },
    { type: "nursery", naming: "upper kindergarten" },
    { type: "nursery", naming: "transition" },
    { type: "nursery", naming: "nursery 1" },
    { type: "nursery", naming: "nursery 2" },

    { type: "primary", naming: "primary 1" },
    { type: "primary", naming: "primary 2" },
    { type: "primary", naming: "primary 3" },
    { type: "primary", naming: "primary 4" },
    { type: "primary", naming: "primary 5" },
    { type: "primary", naming: "primary 6" },

    { type: "secondary", naming: "JSS 1" },
    { type: "secondary", naming: "JSS 2" },
    { type: "secondary", naming: "JSS 3" },
    { type: "secondary", naming: "SS 1" },
    { type: "secondary", naming: "SS 2" },
    { type: "secondary", naming: "SS 3" },

    { type: "pry-grade", naming: "grade 1" },
    { type: "pry-grade", naming: "grade 2" },
    { type: "pry-grade", naming: "grade 3" },
    { type: "pry-grade", naming: "grade 4" },
    { type: "pry-grade", naming: "grade 5" },
    { type: "pry-grade", naming: "grade 6" },

    { type: "sec-grade", naming: "grade 7" },
    { type: "sec-grade", naming: "grade 8" },
    { type: "sec-grade", naming: "grade 9" },
    { type: "sec-grade", naming: "grade 10" },
    { type: "sec-grade", naming: "grade 11" },
    { type: "sec-grade", naming: "grade 12" },

];

const seed = async () => {

    try {
        const prefilledClasses = await Class.bulkCreate(nursery_primary_secondary_grade,
            { updateOnDuplicate: ['naming'], });

            console.log('Classes created for nursery, primary and secondary');

    } catch (error) {
        console.error('Error occurred:', error);
    }
};

seed();
