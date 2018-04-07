const Picolo = artifacts.require("./Picolo.sol");

it('inits contract', async function() {
	const instance = await Picolo.deployed();
	const name = await instance.name();
	assert(instance.name !== 'undefined');
})