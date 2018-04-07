var Picolo = artifacts.require("./Picolo.sol");

module.exports = function(deployer) {
  deployer.deploy(Picolo, 1000000);
};
