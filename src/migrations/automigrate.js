const { db } = require("../database/connection");

class AutoMigrate {

    static async validateModelsIntegrity(){
        const database = db;
        const allModels = Object.values(database.sequelize.models);
        console.log();
        allModels.forEach((model) => {
            this.compareTableAttributes(database, model)
        });

    }

    static async compareTableAttributes(database, model){

        const fieldsToAdd = [];
        const fieldsToRemove = [];
        const fieldsToAlter = []; // No implementation for this yet

        const QueryInterface = database.sequelize.getQueryInterface();
        const tableDescription = await QueryInterface.describeTable(model.tableName);
        const tableColumns = Object.keys(tableDescription);
        const schemaAttributes = Object.keys(model.tableAttributes);

        schemaAttributes.forEach((attribute) => {
            if(!tableColumns.includes(attribute)){
                fieldsToAdd.push(model.tableAttributes[attribute]);
            }
        });

        tableColumns.forEach(attribute => {
            if(!schemaAttributes.includes(attribute)){
                fieldsToRemove.push({
                    ...tableDescription[attribute],
                    fieldName : attribute
                });
            }
        })

        const response = { add : fieldsToAdd, remove : fieldsToRemove };

        this.handleAddColumn(database, model, fieldsToAdd);
        this.handleRemoveColumn(database, model, fieldsToRemove);

    }

    static async handleAddColumn(database, model, fields){
        for (let index = 0; index < fields.length; index++) {
            const field = fields[index];
            try {
                await database.sequelize.queryInterface.addColumn(model.tableName, field.fieldName, {
                  type: field.type,
                  allowNull: field.allowNull,
                });
            } catch (error) {
                console.error('Error adding column', error);
            } finally {
                await database.sequelize.close();
            }
        }

    }

    static async handleRemoveColumn(database, model, fields){
        for (let index = 0; index < fields.length; index++) {
            const field = fields[index];
            try {
                await database.sequelize.queryInterface.removeColumn(model.tableName, field.fieldName,)
            } catch (error) {
                console.error('Error adding column', error);
            } finally {
                await database.sequelize.close();
            }
        }

    }
}

module.exports = AutoMigrate;