const { capitalize } = require("../../utils/string");

const snakeToPascal = (string) => {
    return string.split("_").map((word) => {
        return capitalize(word);
    }).join("");
}

module.exports = {
    formatRelationshipAliases : (...models) => {
        models.forEach((model) => {
            const associations = Object.values(model.associations)
            associations.forEach((association, index) => {
                const associationName = Object.keys(model.associations)[index];
                let singular, plural, singlularProperties, pluralProperties;
                if (association.options.name.singular) {
                    model.associations[associationName].options.name.singular = snakeToPascal(association.options.name.singular);
                    singular =  model.associations[associationName].options.name.singular;
                    singlularProperties = {
                        add: `add${singular}`,
                        create: `create${singular}`,
                        remove: `remove${singular}`,
                        hasSingle: `has${singular}`,
                    };
                }

                if ( association.options.name.plural ) {
                    model.associations[associationName].options.name.plural = snakeToPascal(association.options.name.plural);
                    plural = model.associations[associationName].options.name.plural
                    pluralProperties = {
                        get: `get${plural}`,
                        set: `set${plural}`,
                        addMultiple: `add${plural}`,
                        removeMultiple: `remove${plural}`,
                        hasAll: `has${plural}`,
                        count: `count${plural}`
                    };
                }

                const accessors = {
                    ...singlularProperties ?? {},
                    ...pluralProperties ?? {}
                };
                model.associations[associationName].accessors = accessors;
                model.associationAccessor = plural ?? singular;
                association.mixin(association.source.prototype);
            });
        });
    }
}