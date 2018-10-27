module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new user
    app.post('/user/signup', users.create);

    // Retrieve user with username
    app.post('/user/signin', users.findOne);

    // find user with username and update
    app.put('/user/update/:username', users.update);
    // Create a new supply chain user
    app.post('/create/supplychain/user', users.createSupplyChainUsers);

}