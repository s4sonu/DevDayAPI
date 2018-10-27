module.exports = (app) => {
    const FakeMedicineCtrl = require('../models/fake.medicine.controller.js');

    app.get('/get/All/FakeRecords',FakeMedicineCtrl.getAllFakeMedicineRecords);
}