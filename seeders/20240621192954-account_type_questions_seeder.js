"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    // queryInterface.bulkDelete("onboarding_questions", null, {});

    const data = [
      {
        parent_id: null,
        question: "What are your primary goals for using the platform?",
        options: JSON.stringify(["Coding", "Exam Preparation", "Learning"]),
        type: "single-select",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        parent_id: null,
        question: "What are your primary goals for using the platform?",
        options: JSON.stringify(["Coding", "Exam Preparation", "Learning"]),
        type: "single-select",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        parent_id: null,
        question: "Which subjects are you most interested in?",
        options: JSON.stringify([
          "English",
          "Mathematics",
          "Literature",
          "Basic Science",
          "Economics",
        ]),
        type: "multi-select",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        parent_id: null,
        question: "How many hours per week can you dedicate to studying?",
        options: JSON.stringify(["< 7 hours", "7 hours", "> 7 hours"]),
        type: "single-select",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        parent_id: null,
        question: "Would you like an online coach?",
        options: JSON.stringify(["Yes", "No"]),
        type: "single-select",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        parent_id: null,
        question: "How would you like to track your progress?",
        options: JSON.stringify(["Quizes", "Assignment", "Self-assesment"]),
        type: "single-select",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    queryInterface.bulkInsert("onboarding_questions", null_data, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // queryInterface.bulkDelete("onboarding_questions", null, {});
  },
};
