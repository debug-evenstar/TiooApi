module.exports = {
    equal : (a, b)=>{
        if(a.length === b.length){
            for (let i = 0; i < a.length; i++) {
                const item = a[i];
                if( !b.includes(item) ){
                    return false;
                }
            }
            return true;
        }else{
            return false;
        }
    }
};