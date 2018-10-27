module.exports = (app) => {
    const FakeMedicineCtrl = require('../controllers/fake.medicine.controller.js');

    app.get('/get/All/FakeRecords',FakeMedicineCtrl.getAllFakeMedicineRecords);
}