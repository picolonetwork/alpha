#start tendermint
~/tendermint --home ~/.ethermint/tendermint node &
#start ethermint
~/ethermint --datadir ~/.ethermint --rpc --rpcaddr=0.0.0.0 --ws --wsaddr=0.0.0.0 --rpcapi eth,net,web3,personal,admin
