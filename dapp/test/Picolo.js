const Picolo = artifacts.require("./Picolo.sol");

contract("Picolo", accounts => {
	it('inits contract', async function() {
		const instance = await Picolo.deployed();
		const name = await instance.name();
		assert(instance.name !== 'undefined');
	})

	it('registers database node', async function() {
		const instance = await Picolo.deployed();
		const receipt = await instance.registerNode({from: accounts[2]});
		assert(receipt !== 'undefined');
	})
});