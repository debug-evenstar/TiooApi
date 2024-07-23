"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Disable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // Insert data into the table
    await queryInterface.bulkInsert(
      "onboarding_questions",
      [
        {
          id: 1,
          parent_id: null,
          parent_answer: null,
          question: "Which of the following best describes you?",
          type: "single-select",
          options: JSON.stringify(["Student", "Agent"]),
          created_at: new Date("2024-06-23 05:18:35"),
          updated_at: new Date("2024-06-23 05:18:35"),
        },
        {
          id: 2,
          parent_id: 1,
          parent_answer: "Student",
          question: "What are your primary goals for using the platform?",
          type: "single-select",
          options: JSON.stringify(["Coding", "Exam Preparation", "Learning"]),
          created_at: new Date("2024-06-23 05:18:35"),
          updated_at: new Date("2024-06-23 05:18:35"),
        },
        {
          id: 3,
          parent_id: 7,
          parent_answer: "JAMB",
          question: "Which subjects are you most interested in?",
          type: "multi-select",
          options: JSON.stringify([
            "English",
            "Mathematics",
            "Chemistry",
            "Biology",
            "Literature",
            "Economics",
          ]),
          created_at: new Date("2024-06-23 05:18:35"),
          updated_at: new Date("2024-06-23 05:18:35"),
        },
        {
          id: 4,
          parent_id: 7,
          parent_answer: "JAMB",
          question: "How many hours per week can you dedicate to studying?",
          type: "single-select",
          options: JSON.stringify(["< 7 hours", "7 hours", "> 7 hours"]),
          created_at: new Date("2024-06-23 05:18:35"),
          updated_at: new Date("2024-06-23 05:18:35"),
        },
        {
          id: 5,
          parent_id: 7,
          parent_answer: "JAMB\n",
          question: "Would you like an online coach?",
          type: "single-select",
          options: JSON.stringify(["Yes", "No"]),
          created_at: new Date("2024-06-23 05:18:35"),
          updated_at: new Date("2024-06-23 05:18:35"),
        },
        {
          id: 6,
          parent_id: 7,
          parent_answer: "JAMB",
          question: "How would you like to track your progress?",
          type: "single-select",
          options: JSON.stringify(["Quizes", "Assignment", "Self-assesment"]),
          created_at: new Date("2024-06-23 05:18:35"),
          updated_at: new Date("2024-06-23 05:18:35"),
        },
        {
          id: 7,
          parent_id: 2,
          parent_answer: "Exam Preparation",
          question: "What exams are you preparing for?",
          type: "single-select",
          options: JSON.stringify([
            "UTME",
            "JAMB",
            "WAEC",
            "NECO",
            "GRE",
            "Aptitude test",
            "ICAN",
            "IELT",
          ]),
          created_at: new Date("2024-06-29 16:48:26"),
          updated_at: new Date("2024-06-29 16:48:26"),
        },
      ],
      {}
    );

    // Enable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  },

  down: async (queryInterface, Sequelize) => {
    // Delete data from the table
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    await queryInterface.bulkDelete("onboarding_questions", null, {});

    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  },
};
