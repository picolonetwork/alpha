var enoderpc = process.argv[2];
console.log('Connecting to node: ' + enoderpc);
var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider(enoderpc);
var web3 = new Web3(provider);
// Step 1: Get a contract into my application
var json = require('./abi/Example.json');

// Step 2: Turn that contract into an abstraction I can use
var contract = require('truffle-contract');
var exampleContract = contract(json);

// Step 3: Provision the contract with a web3 provider
exampleContract.setProvider(provider);
if (typeof exampleContract.currentProvider.sendAsync !== "function") {
  exampleContract.currentProvider.sendAsync = function() {
    return exampleContract.currentProvider.send.apply(exampleContract.currentProvider, arguments);
  };
}

// Step 4: Use the contract!
exampleContract.deployed().then(function(instance) {
  instance.constNumber.call().then(function(balance) {
    console.log(balance.toNumber());
  }).catch(function(e) {
    console.log(e);
  });
}).catch(function(e) {
  console.log(e);
});
