class ClassSeeds {
    static nursery = [
        { type: "primary", naming: "primary 1" },
        { type: "primary", naming: "primary 2" },
        { type: "primary", naming: "primary 3" },
        { type: "primary", naming: "primary 4" },
        { type: "primary", naming: "primary 5" },
        { type: "primary", naming: "primary 6" },
    ];

    static primary = [
        { type: "primary", naming: "primary 1" },
        { type: "primary", naming: "primary 2" },
        { type: "primary", naming: "primary 3" },
        { type: "primary", naming: "primary 4" },
        { type: "primary", naming: "primary 5" },
        { type: "primary", naming: "primary 6" },
    ];

    static secondary = [
        { type: "secondary", naming: "JSS 1" },
        { type: "secondary", naming: "JSS 2" },
        { type: "secondary", naming: "JSS 3" },
        { type: "secondary", naming: "SS 1" },
        { type: "secondary", naming: "SS 2" },
        { type: "secondary", naming: "SS 3" },
    ];

    static nurseryToPrimary = [
        ...ClassSeeds.nursery,
        ...ClassSeeds.primary
    ];

    static nurseryToSecondary = [
        ...ClassSeeds.nursery,
        ...ClassSeeds.primary,
        ...ClassSeeds.secondary
    ];

    static primaryGrade = [
        { type: "pry-grade", naming: "grade 1" },
        { type: "pry-grade", naming: "grade 2" },
        { type: "pry-grade", naming: "grade 3" },
        { type: "pry-grade", naming: "grade 4" },
        { type: "pry-grade", naming: "grade 5" },
        { type: "pry-grade", naming: "grade 6" },
    ];



    static secondaryGrade = [
        { type: "sec-grade", naming: "grade 7" },
        { type: "sec-grade", naming: "grade 8" },
        { type: "sec-grade", naming: "grade 9" },
        { type: "sec-grade", naming: "grade 10" },
        { type: "sec-grade", naming: "grade 11" },
        { type: "sec-grade", naming: "grade 12" },
    ];

    static primaryToSecondaryGrade = [
        ...ClassSeeds.primaryGrade,
        ...ClassSeeds.secondaryGrade,
    ];


}


module.exports = ClassSeeds;
