# AirlineOracle

The AirlineOracle is a mobile application which can be used on both established mobile operating systems - Android and iOS.
The App contents a gui and delivers a first approach, how an airline can store new flights inside its flightplan, create new inventories and can update the status of a flight. 
The detailed flight data is stored as a JSON data structure on the ipfs. Only the Content identifier (CID) and all relevant data, to query for, is stored on the smart contract.
The App uses the web3-API "ethers.js" (https://docs.ethers.io/). This API provides a library to build Wallets and interact with the blockchain.


## Login

The first step before a user can process any function, is to login. This requires the BIP39 Mnemonic. The ethers library provides the class "Wallet", which calculates the private Key and the address. Espacially the private key is necesary to sign all messages before a transaction or a function call can happen.

![Screenshot](assets/login.png)

