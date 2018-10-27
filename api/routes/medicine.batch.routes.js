module.exports = (app) => {
    const batch = require('../controllers/medicine.batch.controller.js');

    // Create a new user
    app.post('/medicine/batch/create', batch.create);

    // Retrieve user with username
    app.post('/medicine/batch/recieve', batch.recieve);

    // Retrieve medicine batch with batchid
    app.post('get/medicine/batch/:batchid', batch.findByBatchId);

    // find user with username and update
    app.post('/medicine/batch/dispatch', batch.dispatch);

}