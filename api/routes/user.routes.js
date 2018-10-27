module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new user
    app.post('/user/signup', users.create);

    // Retrieve user with username
    app.post('/user/signin', users.findOne);

    // find user with username and update
    // app.post('/user/update', users.update);

    // Create a new supply chain user
    app.post('/create/supplychain/user', users.createSupplyChainUsers);

    app.get('/get/All/users',users.getAllUsers);

    app.post('/get/transactions',users.getTransactionsForBatchId);

    app.post('/set/batch/delivered',users.setDeliveredForBatch);
    app.post('/verify/medicine/batch',users.verifyMedicineBatch);
}