"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const defaultClasses = [
            { type: "nursery", default: 1, name: "lower kindergarten" },
            { type: "nursery", default: 1, name: "upper kindergarten" },
            { type: "nursery", default: 1, name: "transition" },
            { type: "nursery", default: 1, name: "nursery 1" },
            { type: "nursery", default: 1, name: "nursery 2" },

            { type: "primary", default: 1, name: "primary 1" },
            { type: "primary", default: 1, name: "primary 2" },
            { type: "primary", default: 1, name: "primary 3" },
            { type: "primary", default: 1, name: "primary 4" },
            { type: "primary", default: 1, name: "primary 5" },
            { type: "primary", default: 1, name: "primary 6" },

            { type: "secondary", default: 1, name: "JSS 1" },
            { type: "secondary", default: 1, name: "JSS 2" },
            { type: "secondary", default: 1, name: "JSS 3" },
            { type: "secondary", default: 1, name: "SS 1" },
            { type: "secondary", default: 1, name: "SS 2" },
            { type: "secondary", default: 1, name: "SS 3" },

            { type: "pry-grade", default: 1, name: "grade 1" },
            { type: "pry-grade", default: 1, name: "grade 2" },
            { type: "pry-grade", default: 1, name: "grade 3" },
            { type: "pry-grade", default: 1, name: "grade 4" },
            { type: "pry-grade", default: 1, name: "grade 5" },
            { type: "pry-grade", default: 1, name: "grade 6" },

            { type: "sec-grade", default: 1, name: "grade 7" },
            { type: "sec-grade", default: 1, name: "grade 8" },
            { type: "sec-grade", default: 1, name: "grade 9" },
            { type: "sec-grade", default: 1, name: "grade 10" },
            { type: "sec-grade", default: 1, name: "grade 11" },
            { type: "sec-grade", default: 1, name: "grade 12" },
        ];
        await queryInterface.bulkInsert('classes', defaultClasses, {});
    },

    async down(queryInterface, Sequelize) {
      await queryInterface.bulkInsert('classes', null, {});
    },
};
