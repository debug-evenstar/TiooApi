"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const defaultClasses = [
            { type: "nursery", name: "lower kindergarten" },
            { type: "nursery", name: "upper kindergarten" },
            { type: "nursery", name: "transition" },
            { type: "nursery", name: "nursery 1" },
            { type: "nursery", name: "nursery 2" },

            { type: "primary", name: "primary 1" },
            { type: "primary", name: "primary 2" },
            { type: "primary", name: "primary 3" },
            { type: "primary", name: "primary 4" },
            { type: "primary", name: "primary 5" },
            { type: "primary", name: "primary 6" },

            { type: "secondary", name: "JSS 1" },
            { type: "secondary", name: "JSS 2" },
            { type: "secondary", name: "JSS 3" },
            { type: "secondary", name: "SS 1" },
            { type: "secondary", name: "SS 2" },
            { type: "secondary", name: "SS 3" },

            { type: "pry-grade", name: "grade 1" },
            { type: "pry-grade", name: "grade 2" },
            { type: "pry-grade", name: "grade 3" },
            { type: "pry-grade", name: "grade 4" },
            { type: "pry-grade", name: "grade 5" },
            { type: "pry-grade", name: "grade 6" },

            { type: "sec-grade", name: "grade 7" },
            { type: "sec-grade", name: "grade 8" },
            { type: "sec-grade", name: "grade 9" },
            { type: "sec-grade", name: "grade 10" },
            { type: "sec-grade", name: "grade 11" },
            { type: "sec-grade", name: "grade 12" },
        ];
        await queryInterface.bulkInsert('classes', defaultClasses, {});
    },

    async down(queryInterface, Sequelize) {
      await queryInterface.bulkInsert('classes', null, {});
    },
};
