
var Medchain = artifacts.require("./Medchain.sol");


module.exports = function(deployer) {

  deployer.deploy(Medchain);
};
