var Migrations = artifacts.require("Migrations");
var Example = artifacts.require("Example");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations);
  deployer.deploy(Example);
};
