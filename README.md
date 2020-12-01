# AirlineOracle

The AirlineOracle is a mobile application which can be used on both established mobile operating systems - Android and iOS.
The App contents a gui and delivers a first approach, how an airline can store new flights inside its flightplan, create new inventories and can update the status of a flight. 
The detailed flight data is stored as a JSON data structure on the ipfs. Only the Content identifier (CID) and all relevant data for queries are stored on the smart contract.
The App uses the web3-API "ethers.js" (https://docs.ethers.io/). This API provides a library to build Wallets and interact with the blockchain.



## Login

Login is possible with the individual BIP39 Mnemonic.


## Create new Flight

To create a new Flight the user needs to fill out the form and sends the data to the contract ["OperationsPlan"](https://github.com/dedurak/smartcontracts/blob/main/smart_contracts/contracts/OperationPlan.sol) by pressing on "Create Flight". 
The airline defines on which weekdays the flight will be operated and can set the ticketprice for each operating day.


## Create new Inventory

First of all the airline searches for the flight for which the inventory shall be created. The necessary data for the inventory is the aircraft type, the registration of it and how many seats are available. This information is important to ensure that no overbooking of a planned flight can happen. 
There are many cases where passengers were rebooked to another flight because of overbooking. Now this case is eliminated and not more possible.


## Update Flight Status

-- TODO --


