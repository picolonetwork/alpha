module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
  	development: {
  		host: "127.0.0.1",
  		port: "7545",
  		network_id: "*" // match all
  	},
  	ethermint: {
		host: "0.0.0.0",
		port: "8545",
		network_id: "*", // match all
  		from: "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef"
  	}
  }
};
