const Picolo = artifacts.require("./Picolo.sol");

contract("Picolo", accounts => {
	it('inits contract', async function() {
		const instance = await Picolo.deployed();
		const name = await instance.name();
		assert(instance.name !== 'undefined');
	})

	it('registers database node', async function() {
		const instance = await Picolo.deployed();
		const receipt = await instance.registerNode({from: accounts[1], value: 4});
		assert(receipt.logs[0].event, 'registeredEvent', 'correct event for registration');
		const stake = await instance.registeredNodesStake(accounts[1]);
		assert(stake, 4, 'stake stored correctly');
	})
});