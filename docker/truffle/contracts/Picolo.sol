pragma solidity ^0.4.2;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Priced {
    // Modifiers can receive arguments:
    modifier costs(uint price) {
        require(msg.value == price);
        _;
    }
}

contract Picolo is Ownable, Priced {

  	using SafeMath for uint256;

  	   	// Todo: refactor into subcontract
   	uint public entryStake = 4;  // amount for testing
   	mapping(address => uint) public registeredNodesStake;
   	mapping(address => string) public nodeStatus;

   	uint public convictThreshold = 3;
   	mapping(address => uint) public voteTally;
   	mapping(address => uint) public maliciousVoteTally;
   	mapping(address => bool) public evictionVoters;

    // Status of transaction. Used for error handling.
    event Status(string indexed statusCode);

   	event nodeStatusChangeEvent (
   		string indexed newStatus,
   		address indexed sender
   	);

   	function registerNode() public {
   	   	require(keccak256(nodeStatus[msg.sender]) == keccak256(""));
   	   	nodeStatus[msg.sender] = 'registered';
   	   	emit nodeStatusChangeEvent('registered', msg.sender);
   	}

   	function sendDeposit() public payable costs(entryStake) {
   		require(keccak256(nodeStatus[msg.sender]) == keccak256("registered"));
   		registeredNodesStake[msg.sender] = entryStake;
   		nodeStatus[msg.sender] = 'valid';
   	   	emit nodeStatusChangeEvent('valid', msg.sender);
  	}

   	function startMining() public {
   		require(keccak256(nodeStatus[msg.sender]) == keccak256("valid"));
   	   	nodeStatus[msg.sender] = 'active';
   	   	emit nodeStatusChangeEvent('active', msg.sender);
   	}

   	function stopMining() public {
   		require(keccak256(nodeStatus[msg.sender]) == keccak256("active"));
   	   	nodeStatus[msg.sender] = 'inactive';
   	   	emit nodeStatusChangeEvent('inactive', msg.sender);
   	}

   	function claimDeposit() public {
   		require(keccak256(nodeStatus[msg.sender]) != keccak256("malicious"));
   		require(keccak256(nodeStatus[msg.sender]) == keccak256("pending"));
   		msg.sender.transfer(registeredNodesStake[msg.sender]);
   	   	nodeStatus[msg.sender] = 'registered';
   	   	emit nodeStatusChangeEvent('registered', msg.sender);
   	}

   	function changeEntryStake(uint _price) public onlyOwner {
        entryStake = _price;
    }

    // Challenges
    function addPotentialMalicious(address _target) public onlyOwner {
    	require(keccak256(nodeStatus[_target]) == keccak256("malicious"));
   	   	nodeStatus[msg.sender] = 'pending';
    }

    // Consensus
    function voteMalicious(address _target, bool _convict) public {
    	require(keccak256(nodeStatus[msg.sender]) == keccak256("pending"));
    	voteTally[_target].add(1);
    	if (_convict) {
    		maliciousVoteTally[_target].add(1);
    	}
    	if (voteTally[_target] >= convictThreshold
    		&& maliciousVoteTally[_target].mul(2) > voteTally[_target]) {
    		nodeStatus[_target] = 'malicious';
   	   		emit nodeStatusChangeEvent('malicious', msg.sender);
    	}
    }
    // todo: TCR for masternodes
}
