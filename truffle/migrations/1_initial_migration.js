var Migrations = artifacts.require("Migrations");
var Example = artifacts.require("Example");
var Picolo = artifacts.require("Picolo");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations);
  deployer.deploy(Example);
  deloyer.deploy(Picolo);
};
