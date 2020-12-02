# AirlineOracle

The AirlineOracle is a mobile application, usable on both established mobile operating systems - Android and iOS.
The App contains and delivers a first approach, how an airline can store new flights inside its flightplan, create new inventories and update the state of a flight. 
The detailed flight data is stored as a JSON data structure on the [IPFS](https://ipfs.io/). Only the Content identifier (CID) and all relevant data for queries are stored on the smart contract.
The App uses the web3-API [ethers.js](https://docs.ethers.io/). This API provides a library to build Wallets and interact with the blockchain and the underlying smart contracts.



## Download/Install

At the moment the prototype is in development. After launch to production you can download the app from the appropriate app stores.
If you are intereseted, please don't hesitate to download the code by typing following command in your command line:

`git clone https://github.com/dedurak/Airline_Oracle`



## Instructions

### Login

Login is possible with the individual BIP39 Mnemonic.


### Create new Flight

To create a new Flight the user needs to fill out the form and sends the data to the contract ["OperationsPlan"](https://github.com/dedurak/smartcontracts/blob/main/smart_contracts/contracts/OperationPlan.sol) by pressing on "Create Flight". 
The airline defines on which weekdays the flight will be operated and can set the ticketprice for each operating day.


### Create new Inventory

First of all the airline searches for the flight for which the inventory shall be created. The necessary data for the inventory is the aircraft type, the registration of it and how many seats are available. This information is important to ensure that no overbooking of a planned flight can happen. 
There are many cases where passengers were rebooked to another flight because of overbooking. Now this case is eliminated and not more possible.


### Update Flight Status

The user has the options to search for all planned flights by entering the date. After all flights are found, the details will be displayed on a the following screen. 
To change the state of a flight, the user first presses on the appropriate box to get displayed the state dialog, where the new state can be selected from a dropdown menu. 
If the airline is used to cancel the flight, the app gets the passengerlist from the smart contract and starts to refund all booking payments to the passengers. If the user selects the state "ARR_DELAYED", the dialog shows another field where the minutes of the delay needs to be inserted (if it's empty, update is blocked). 

Before a passenger can check-in for a flight, the airline should consider that the state is changed to "CHECKIN". Otherwise the check-in is not possible.

This app aims to demonstrate and visualize the fundamental steps of a new revolutionary process how refundings, following on a flight cancellation, or compensation payments, according to the european fligth passenger regulations (EU 261/2004), can be fully automatized without any necessary execution from employee-side.


### Token Portal

This portal shows the current balance of FLY-Tokens. There is also a table where all details to the last payments are shown in order to get a review.
