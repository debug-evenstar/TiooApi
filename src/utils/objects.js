module.exports = {
    getAllFuncs : (toCheck) => {
        const props = [];
        let obj = toCheck;
        do {
            const op = Object.getOwnPropertyNames(obj);
            props.push(...op);
        } while (obj = Object.getPrototypeOf(obj));
        return props.sort().filter((e, i, arr) => { 
            try{
                if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
            }catch(err){
                return true;
            }

        });
    }
}