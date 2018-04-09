App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // initialize web3
    if (typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //create a new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    App.displayAccountInfo();

    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if (err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + " TOKENS");
          }
        })
      }
    });
  },

  initContract: function() {
    $.getJSON('Picolo.json', function(PicoloArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.Picolo = TruffleContract(PicoloArtifact);
      // set the provider for our contracts
      App.contracts.Picolo.setProvider(App.web3Provider);
      // listen to events
      //App.listenToEvents();
      // retrieve the article from the contract
      //return App.reloadArticles();
    });
    var abiArray = [{
        constant: true,
        inputs: [],
        name: 'totalPayments',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          [Object],
          [Object]
        ],
        name: 'approve',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          [Object],
          [Object],
          [Object]
        ],
        name: 'transferFrom',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          [Object]
        ],
        name: 'registeredNodesStake',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          [Object]
        ],
        name: 'maliciousVoteTally',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'version',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          [Object]
        ],
        name: 'nodeStatus',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'entryStake',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          [Object]
        ],
        name: 'balanceOf',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'convictThreshold',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          [Object],
          [Object]
        ],
        name: 'transfer',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          [Object]
        ],
        name: 'voteTally',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          [Object],
          [Object]
        ],
        name: 'allowance',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          [Object]
        ],
        name: 'transferOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          [Object]
        ],
        name: 'validators',
        outputs: [
          [Object]
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor'
      },
      {
        anonymous: false,
        inputs: [
          [Object]
        ],
        name: 'Status',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          [Object],
          [Object]
        ],
        name: 'nodeStatusChangeEvent',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          [Object],
          [Object],
          [Object]
        ],
        name: 'Transfer',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          [Object],
          [Object],
          [Object]
        ],
        name: 'Approval',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          [Object],
          [Object]
        ],
        name: 'OwnershipTransferred',
        type: 'event'
      },
      {
        constant: false,
        inputs: [],
        name: 'register',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [],
        name: 'start',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [],
        name: 'stop',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [],
        name: 'unregister',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          [Object]
        ],
        name: 'claimMiningRewards',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          [Object]
        ],
        name: 'changeEntryStake',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          [Object]
        ],
        name: 'addPotentialMalicious',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          [Object],
          [Object]
        ],
        name: 'voteMalicious',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]

    App.contracts.Pic2 = web3.eth.contract(abiArray).at('0x28eb60edd659d1725540f853d919483657b4e39a');
  },

  register: function() {
    // retrieve the detail of the article
    console.log('register called');
    var _article_name = $('#article_name').val();
    var _description = $('#article_description').val();
    var _price = web3.toWei(parseFloat($('#article_price').val() || 0), "ether");

    if ((_article_name.trim() == '') || (_price == 0)) {
      // nothing to sell
      return false;
    }

    App.contracts.Pic2.register({
      from: App.account
    });

    App.contracts.Picolo.deployed().then(function(instance) {
      console.log(instance);
      return instance.register();
    }).then(function(result) {
      console.log(result);
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
