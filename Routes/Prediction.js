const express = require('express');
const router = express.Router();

const {
    addInventory,
    deleteInventory,
    deleteAllInventoryItems,
    addBloodPressure,
    addSugar,
    getBPPredction,
    getLevels,
} = require('../Controllers/Predictions');

const {auth} = require( '../Middlewares/auth' );

//prediction routes

router.post('/add-item', auth, addInventory);
router.delete('/delete-item', auth, deleteInventory);
router.delete('/delete-all', auth, deleteAllInventoryItems);
router.put('/add-bloodpressure', auth, addBloodPressure);
router.put('/add-sugar', auth, addSugar);
router.post('/bloodpressure-prediction', auth, getBPPredction);
router.post('/get-levels', auth, getLevels);


module.exports = router;
