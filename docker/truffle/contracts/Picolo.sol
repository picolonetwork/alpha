pragma solidity ^0.4.2;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./StandardToken.sol";

contract Picolo is Ownable, StandardToken {

  	using SafeMath for uint256;

    // metadata
    string public constant name = "Picolo Token";
    string public constant symbol = "PIC";
    uint256 public constant decimals = 18;
    string public version = "1.0";

   	uint public entryStake = 10 ether;  // amount of eth required for staking
   	mapping(address => uint) public registeredNodesStake;
   	mapping(address => string) public nodeStatus;
    uint256 public totalPayments;

   	uint public convictThreshold = 3;
   	mapping(address => uint) public voteTally;
   	mapping(address => uint) public maliciousVoteTally;
   	mapping(address => bool) public validators;

    function Picolo() public {
      totalSupply = 1 * (10**9) * 10**decimals;
    }

    // Status of transaction. Used for error handling.
    event Status(string indexed statusCode);

   	event nodeStatusChangeEvent (
   		string indexed newStatus,
   		address indexed sender
   	);

    modifier costs(uint price) {
        require(msg.value == price);
        _;
    }

    modifier onlyValidators() {
        require(validators[msg.sender]);
        _;
    }

   	function register() public payable costs(entryStake) {
      require(keccak256(nodeStatus[msg.sender]) == keccak256(""));
      nodeStatus[msg.sender] = 'inactive';
   		registeredNodesStake[msg.sender] = entryStake;
      emit nodeStatusChangeEvent('inactive', msg.sender);
  	}

   	function start() public {
 		  require(keccak256(nodeStatus[msg.sender]) == keccak256("inactive"));
 	   	nodeStatus[msg.sender] = 'active';
 	   	emit nodeStatusChangeEvent('active', msg.sender);
   	}

   	function stop() public {
 		  require(keccak256(nodeStatus[msg.sender]) == keccak256("active"));
 	   	nodeStatus[msg.sender] = 'inactive';
 	   	emit nodeStatusChangeEvent('inactive', msg.sender);
   	}

   	function unregister() public {
      address payee = msg.sender;
   		require(keccak256(nodeStatus[payee]) != keccak256("malicious"));
   		require(keccak256(nodeStatus[payee]) != keccak256("pending"));
      require(payment != 0);
      require(this.balance >= payment);

      uint256 payment = registeredNodesStake[payee];
      registeredNodesStake[payee] = 0;
      nodeStatus[payee] = '';
      payee.transfer(payment);
 	   	emit nodeStatusChangeEvent('unregistered', msg.sender);
   	}

    function claimMiningRewards(uint256 payment) public {
      address payee = msg.sender;
      require(payment != 0);
      balances[payee].add(payment);
      totalPayments = totalPayments.add(payment);
    }

   	function changeEntryStake(uint _price) public onlyOwner {
        entryStake = _price;
    }

    // Challenges
    function addPotentialMalicious(address _target) public {
    	require(keccak256(nodeStatus[_target]) != keccak256("malicious"));
   	  nodeStatus[_target] = 'pending';
    }

    // Consensus
    function voteMalicious(address _target, bool _convict) public onlyValidators {
    	require(keccak256(nodeStatus[_target]) == keccak256("pending"));
    	voteTally[_target].add(1);
    	if (_convict) {
    		maliciousVoteTally[_target].add(1);
    	}
    	if (voteTally[_target] >= convictThreshold
    		&& maliciousVoteTally[_target].mul(2).add(1) > voteTally[_target]) {
    		nodeStatus[_target] = 'malicious';
   	   	emit nodeStatusChangeEvent('malicious', msg.sender);
    	}
    }
    // todo: TCR for masternodes
}
