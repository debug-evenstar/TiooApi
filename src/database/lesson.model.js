const bcrypt = require("bcrypt");

// TO BE REVISITED
const getLessonStatus = (instance) => {
    if (
        instance.getDataValue("start_date") &&
        instance.getDataValue("end_date")
    ) {
        const start = instance.getDataValue("start_date");
        const end = instance.getDataValue("end_date");
        const currentDate = new Date();
        if (start <= currentDate && currentDate <= end) {
            return "UNLOCKED";
        }
    }
    return instance.getDataValue("status");
};

module.exports = (sequelize, Sequelize) => {
    const Lesson = sequelize.define(
        "Lesson",
        {
            topic: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            duration: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "15 Minutes",
            },
            curriculum: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "",
            },
            objective: {
                type: Sequelize.STRING,
                defaultValue: "",
                allowNull: true,
            },
            additional_instruction: {
                type: Sequelize.STRING,
                defaultValue: "",
                allowNull: true,
            },
            week: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "",
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM(
                    "ACTIVE",
                    "INACTIVE",
                    "LOCKED",
                    "UNLOCKED"
                ), // LOCKED AND UNLOCKED ARE ADMIN STATUSES
                allowNull: true,
                defaultValue: "ACTIVE",
                get() {
                    return getLessonStatus(this);
                },
            },
            published: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            term: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 1,
            },
            chapter: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            preview: {
                type: Sequelize.JSON,
                defaultValue: [],
            },
            files: {
                type: Sequelize.JSON,
                defaultValue: [],
            },
            generated: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: "",
            },
            session_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            library: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
        },
        { timestamps: true, paranoid : true }
    );

    return Lesson;
};
