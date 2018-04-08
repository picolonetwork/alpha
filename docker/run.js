'use strict';

const {
  spawn
} = require('child_process');
const Web3 = require('web3');
const contractAbstraction = require('truffle-contract');
const http = require('http');

const enoderpc = process.argv[2];
console.log('Using node: ' + enoderpc);
const provider = new Web3.providers.HttpProvider(enoderpc);
const web3 = new Web3(provider);

// Step 1: Get a contract into my application
const picoloJson = require('./abi/Picolo.json');

// Step 2: Turn that contract into an abstraction I can use
const picoloContract = contractAbstraction(picoloJson);

// Step 3: Provision the contract with a web3 provider
picoloContract.setProvider(provider);
// due to a bug add below lines
if (typeof picoloContract.currentProvider.sendAsync !== "function") {
  picoloContract.currentProvider.sendAsync = function() {
    return picoloContract.currentProvider.send.apply(picoloContract.currentProvider, arguments);
  };
}

// Step 4: Start server and use the contract!
http.createServer(function(req, res) {
  let url = req.url;
  if (url === '/register') {
    register(req, res);
  } else if (url === '/start') {
    start(req, res);
  } else if (url === '/stop') {
    stop(req, res);
  } else if (url === '/unregister') {
    unregister(req, res);
  } else {
    res.write('invalid request');
    res.end();
  }
}).listen(9090);

function register(req, res) {
  picoloContract.deployed().then(function(instance) {
    instance.registerNode().then(function(balance) {
      let number = balance.toNumber();
      res.write('Request received: ' + req.url + ' Number is: ' + number); //write a response to the client
      res.end();
    }).catch(function(e) {
      res.write(e); //write a response to the client
      res.end();
    });
  }).catch(function(e) {
    res.write(e); //write a response to the client
    res.end();
  });
}

function start(req, res) {
  let db = spawn('./cockroach', ['start', '--insecure', '--background']);
  followStd(db);
  res.write('Request received: ' + req.url); //write a response to the client
  res.end();
}

function stop(req, res) {
  let db = spawn('./cockroach', ['quit', '--insecure']);
  followStd(db);
  res.write('Request received: ' + req.url); //write a response to the client
  res.end();
}

function unregister(req, res) {
  decommission();
}

function decommission() {
  let db = spawn('./cockroach', ['quit', '--insecure']);
  //let db = spawn('./cockroach', ['quit', '--insecure', '--decommission']);
  followStd(db);
}

function followStd(db) {
  db.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  db.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  db.on('close', (code) => {
    console.log(`child process exited with code: ${code}`);
  });
}
