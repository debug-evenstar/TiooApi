
module.exports = { 
    createValidator : (schema) => {
        return async (req, res, next) => {
            console.log(req.body);
            const Vine = await import('@vinejs/vine');
            const vine = Vine.default;
            try {
                const validator = vine.compile(schema(vine));
                const output = await validator.validate(req.body);
                next();
            } catch (error) {
                if (error instanceof Vine.errors.E_VALIDATION_ERROR) {
                    res.status(400).json({ 
                        errors: error.messages.map((e)=>({
                            field : e.field,
                            message : e.message
                        }))
                    });
                }
            }
        };
    }
}