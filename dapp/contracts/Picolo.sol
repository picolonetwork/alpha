pragma solidity ^0.4.2;

import "./ownable.sol";
import "./SafeMath.sol";



contract priced {
    // Modifiers can receive arguments:
    modifier costs(uint price) {
        require(msg.value == price);
        _;
    }
}

contract Picolo is Ownable, priced {

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
   	   	nodeStatusChangeEvent('registered', msg.sender);
   	}

   	function sendDeposit() public payable costs(entryStake) {
   		require(keccak256(nodeStatus[msg.sender]) == keccak256("registered"));
   		registeredNodesStake[msg.sender] = entryStake;	
   		nodeStatus[msg.sender] = 'valid';
   	   	nodeStatusChangeEvent('valid', msg.sender);
  	}

   	function startMining() public {
   		require(keccak256(nodeStatus[msg.sender]) == keccak256("valid"));
   	   	nodeStatus[msg.sender] = 'active';	
   	   	nodeStatusChangeEvent('active', msg.sender);
   	}

   	function stopMining() public {
   		require(keccak256(nodeStatus[msg.sender]) == keccak256("active"));
   	   	nodeStatus[msg.sender] = 'inactive';	
   	   	nodeStatusChangeEvent('inactive', msg.sender);
   	}

   	function claimDeposit() public {
   		require(keccak256(nodeStatus[msg.sender]) != keccak256("malicious"));
   		require(keccak256(nodeStatus[msg.sender]) == keccak256("pending"));
   		msg.sender.transfer(registeredNodesStake[msg.sender]);
   	   	nodeStatus[msg.sender] = 'registered';	
   	   	nodeStatusChangeEvent('registered', msg.sender);
   	}

   	function changeEntryStake(uint _price) public onlyOwner {
        entryStake = _price;
    }

    // Challenges 
    function addPotentialMalicious(address _target) public onlyOwner {
    	require(keccak256(nodeStatus[msg.sender]) == keccak256("malicious"));
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
   	   		nodeStatusChangeEvent('malicious', msg.sender);
    	}
    }

    string  public name = "Picolo Token";
    string  public symbol = "PCT";
    string  public standard = "Picolo Token v1.0";
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function Picolo (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // erc20
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        Transfer(msg.sender, _to, _value);	

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        Transfer(_from, _to, _value);

        return true;
    }
    // todo: TCR for masternodes
}