import { Wallet, Contract } from 'ethers';

export class WalletUtiils {
    
    
    mnemonic = "";
    privateKey = "";
    publicKey = "";
    address = "";
    
    setMnemonic(param) {
        this.mnemonic = param;
    }

    setParams() {
        
        const walletMnemonic = Wallet.fromMnemonic(this.mnemonic);
        
        this.privateKey = walletMnemonic.privateKey;

        this.address = walletMnemonic.address;
    }

    getMnemonic() { return this.mnemonic }
    getPrivateKey() { return this.privateKey }
    getPublicKey() { return this.publicKey }
    getAddress() { return this.address }

}

export class WalletMethods {

    wallet;
    contract;

    constructor(prvKey, provider) {
        this.wallet = new Wallet(prvKey, provider);
    }

    getWallet() { return this.wallet }

    createContractInstance(address, abi, signer) {
        this.contract = new Contract(address, abi, signer);
        return this.contract;
    }
}


export class Contracts {
    flightPlan;
    flightToken;
    invContract;
    pssInstance;

    setFlightPlanContract(param) {this.flightPlan = param}
    getFlightPlanContract() { return this.flightPlan }

    setFlightToken(param) {this.flightToken = param}
    getFlightToken() { return this.flightToken}

    setInvContract(param) {this.invContract = param}
    getInvContract() {return this.invContract}

    setPssInstance(param) {this.pssInstance = param}
    getPssInstance() {return this.pssInstance}
}