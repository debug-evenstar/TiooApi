const express = require('express');
router = express.Router();


//==================================== HOME ===================================//

router.get('/', (req, res)=>{ res.json({ message: "NIMO SERVER RUNNING...." })});

//================================ CONTROLLERS ================================//


//================================ REQUEST VALIDATOR ============================//


//================================ TOKEN VALIDATOR ===============================//



module.exports = router;

