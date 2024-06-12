const { capitalize } = require("../../utils/string");

const snakeToPascal = (string) => {
    return string.split("_").map((word) => {
        return capitalize(word);
    }).join("");
}

module.exports = {
    formatRelationshipAliases : (...models) => {
        models.forEach((model) => {
            if (model.name == "Lesson") {
                const associations = Object.values(model.associations)
                associations.forEach((association, index) => {
                    const associationName = Object.keys(model.associations)[index];
                    model.associations[associationName].options.name.plural = snakeToPascal(association.options.name.plural);
                    model.associations[associationName].options.name.singular = snakeToPascal(association.options.name.singular);
                    const plural = model.associations[associationName].options.name.plural
                    const singular =  model.associations[associationName].options.name.singular;
                    const accessors = {
                        get: `get${plural}`,
                        set: `set${plural}`,
                        addMultiple: `add${plural}`,
                        add: `add${singular}`,
                        create: `create${singular}`,
                        remove: `remove${singular}`,
                        removeMultiple: `remove${plural}`,
                        hasSingle: `has${singular}`,
                        hasAll: `has${plural}`,
                        count: `count${plural}`
                    };
                    model.associations[associationName].accessors = accessors;
                    model.associationAccessor = plural;
                    association.mixin(association.source.prototype);
                });
            }
        });
    }
}