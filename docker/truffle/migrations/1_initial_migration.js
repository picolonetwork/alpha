var Migrations = artifacts.require("Migrations");
var Picolo = artifacts.require("Picolo");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations);
  deployer.deploy(Picolo);
};
