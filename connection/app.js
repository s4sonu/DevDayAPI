const contract = require('truffle-contract');
const supply_artifact = require('../build/contracts/Medchain.json');
var Supply = contract(supply_artifact);

module.exports = {
  start: function (callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },
  createAccount: function (password, callback) {
    var self = this;
    self.web3.personal.newAccount(password, function (err, accs) {
      if (err != null) {
        alert("There was an error creating you account.");
        return;
      }
      self.web3.personal.unlockAccount(accs, password, 0);
      self.web3.eth.sendTransaction({
        from: "0x46399939e3ad1b004344f7cc96f1a495500234a0",
        to: accs,
        value: self.web3.toWei(10, "ether")
      });
      console.log(accs);
      callback(accs);
    });
  },
  createBatch: function (_batchId, _noOfMedicines, _manufacturedDate, _createdDate, _expirydate, _location, _sourceCountry, _destinationCountry, sender, callback) {
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function (instance) {
      supply = instance;
      return supply.createBatch(_batchId, _noOfMedicines, _manufacturedDate, _createdDate, _expirydate, _location, _sourceCountry, _destinationCountry, {
        from: sender,
        gas: 4600000
      });
    }).then(function (data) {
      callback(data)
    }).catch(function (e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  updateBatchStatusToReceived: function (_batchId, _destinationCountry, sender, callback) {
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function (instance) {
      supply = instance;
      return supply.receiveBatch(_batchId, _destinationCountry, {
        from: sender,
        gas: 4600000
      });
    }).then(function (data) {
      console.log(data)
      callback(data)
    }).catch(function (e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  updateBatchStatusToDispatched: function (batchId, destinationCountry, sender, callback) {
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function (instance) {
      supply = instance;
      return supply.dispatchBatch(batchId, destinationCountry, {
        from: sender,
        gas: 4600000
      });
    }).then(function (data) {
      console.log(data)
      callback(data)
    }).catch(function (e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  getBatch: async function (_batchId, sender, callback) {
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function (instance) {
      supply = instance;
      return supply.getBatchData(_batchId, {
        from: sender,
        gas: 4600000
      });
    }).then(function (data) {
      console.log(data)
      let result = {
        "batchId": data[0],
        "numOfMedicines": data[1],
        "location": data[2],
        "currentOwnerName": data[3],
        "currentOwner": data[4],
        "status": data[5],
        "currentOwnerType": data[6],
        "sourceCountry": data[7],
        "destinationCountry": data[8]
      }
      supply.getBatchDateData(_batchId, {
        from: sender,
        gas: 4600000
      }).then(datas => {
        result["manufacturedDate"] = datas[1];
        result["expiryDate"] = datas[2];
        result["createdDate"] = datas[3];
        result["deliveredDate"] = datas[3];
        callback(result)
      }).catch(function (e) {
        console.log(e);
        callback("ERROR 404");
      });

    }).catch(function (e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  createSupplyChainUsers: function (userName, userAccount, userType, sender, callback) {
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function (instance) {
      supply = instance;
      return supply.createUser(userName, userAccount, userType, {
        from: sender,
        gas: 4600000
      });
    }).then(function (data) {
      callback(data)
    }).catch(function (e) {
      console.log(e);
      callback("ERROR 404");
    });
  },

  getMedicineData: function (_batchId, sender) {
    return new Promise((resolve, reject) => {
      var self = this;
      // Bootstrap the Supply abstraction for Use.
      Supply.setProvider(self.web3.currentProvider);

      var meta;
      Supply.deployed().then(function (instance) {
        supply = instance;
        return supply.getBatchData(_batchId, {
          from: sender,
          gas: 4600000
        });
      }).then(function (data) {
        console.log(data)
        let result = {
          "batchId": data[0],
          "numOfMedicines": data[1],
          "location": data[2],
          "currentOwnerName": data[3],
          "currentOwner": data[4],
          "status": data[5],
          "currentOwnerType": data[6],
          "sourceCountry": data[7],
          "destinationCountry": data[8]
        }
        if (data[0]) {
          resolve(result)
        } else {
          resolve("fail")
        }
      }).catch(function (e) {
        console.log(e);
        callback("ERROR 404");
      });
    })
  },
  verifyMedicineBatch: function (_batchId, sender, callback){
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function (instance) {
      supply = instance;

    }).then(function (data) {
        
      }).catch(function (e) {
        console.log(e);
        callback("ERROR 404");
      });
  },
  setDeliveredForBatch: function(_batchId, sender, callback){
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function (instance) {
      supply = instance;

    }).then(function (data) {
        
      }).catch(function (e) {
        console.log(e);
        callback("ERROR 404");
      });
  }
}
