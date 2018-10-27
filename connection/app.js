const contract = require('truffle-contract');

const metacoin_artifact = require('../build/contracts/MetaCoin.json');
var MetaCoin = contract(metacoin_artifact);
// const supply_artifact = require('../build/contracts/MylanSupplyChain.json');
// var Supply = contract(supply_artifact);

module.exports = {
  start: function(callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
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
  refreshBalance: function(account, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },
  sendCoin: function(amount, sender, receiver, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: sender});
    }).then(function() {
      self.refreshBalance(sender, function (answer) {
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  createAccount:function(password, callback ){
    var self = this;
    self.web3.personal.newAccount(password, function(err, accs) {
      if (err != null) {
        alert("There was an error creating you account.");
        return;
      }
      console.log(accs);
      callback(accs);
    });
  },
  createBatch:function(_batchId,_noOfMedicines,_manufacturedDate,_createdDate,_expirydate,_location,_sourceCountry, _destinationCountry){
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function(instance) {
      supply = instance;
      return supply.createBatch(_batchId, _noOfMedicines,_manufacturedDate,_createdDate,_expirydate,_location,_sourceCountry, _destinationCountry, {from: sender, gas:4600000});
    }).then(function(data) {
      callback(data)
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  updateBatchStatusToReceived: function(_batchId, _destinationCountry ,sender, callback) {
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function(instance) {
      supply = instance;
      return supply.updateBatchStatusToReceived(_batchId, _destinationCountry, {from: sender, gas:4600000});
    }).then(function(data) {
      console.log(data)
      callback(data)
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  updateBatchStatusToDispatched: function(_batchId, _destinationCountry ,sender, callback) {
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function(instance) {
      supply = instance;
      return supply.updateBatchStatusToDispatched(_batchId, destinationCountry, {from: sender, gas:4600000});
    }).then(function(data) {
      console.log(data)
      callback(data)
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  getBatch: function(_batchId ,sender, callback) {
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function(instance) {
      supply = instance;
      return supply.getBatch(_batchId, {from: sender, gas:4600000});
    }).then(function(data) {
      console.log(data)
      let result ={
        "batchId":data[0],
        "numOfMedicines":data[1],
        "startdate":data[2],
        "enddate":data[3],
        "status":data[4],
        "currentOwwner":data[5],
        "currentOwnerType":data[6],
        "sourceCountry":data[7],
        "destinationCountry":data[8]
      }
      callback(result)
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  createSupplyChainUsers: function(userAddress, userType ,sender, callback) {
    var self = this;
    // Bootstrap the Supply abstraction for Use.
    Supply.setProvider(self.web3.currentProvider);

    var meta;
    Supply.deployed().then(function(instance) {
      supply = instance;
      return supply.createUser(userAddress, userType, {from: sender, gas:4600000});
    }).then(function(data) {
      callback(data)
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  }
}
