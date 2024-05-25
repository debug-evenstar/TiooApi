const { db } = require("../../../database/connection");
const { generateRule } = require("../Base");

module.exports = {
    exists: generateRule(async (value, options, field) => {
        const model = Object.values(db.sequelize.models).filter(
            (m) => m.tableName == options.table
        )[0];
        const modelInstance = await model.findByPk(value);
        if (!modelInstance) {
            field.report(
                "Record with specified {{ field }} not found",
                "unique",
                field
            );
        }
    }),
};
