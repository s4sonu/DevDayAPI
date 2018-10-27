module.exports = (app) => {
    const userBatchInteraction = require('../controllers/user.batch.interaction.controllers.js');
    // Retrieve user and batchids associated with username
    app.post('/get/user/batches', userBatchInteraction.getBatchesInfoForUser);
}