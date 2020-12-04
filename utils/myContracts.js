export class MyContracts {
    flightPlan_ADDR = "0xeA425418DFEdB87c0faf35D8Eab1Ad7F48D8c30c";
    flightPlan_ABI = [
        // functions
        "function issueFlight(string memory _from, string memory _to,  uint _status, string memory cid)",
        "function searchFlight( string memory _from, string memory _to) public view returns (string memory)",

        //events
        " event newFlightIssued(string _from, string _to, uint _status)"
    ];

    flightToken_ADDR = "0xFc46539eb3394870d363Cb65BBE5478710F4f021";
    flightToken_ABI = [
        // functions
        "function totalSupply() public view returns(uint256)",
        "function balanceOf(address owner) public view returns(uint256)",
        "function allowance(address owner,address spender) public view returns(uint256)",
        "function transfer(address to, uint256 value) public returns(bool)",
        "function approve(address spender, uint256 value) public returns(bool)",
        "function transferFrom(address from, address to, uint256 value ) public returns(bool)",
        "function increaseAllowance(address spender, uint256 addedValue) public returns(bool)",
        "function decreaseAllowance(address spender, uint256 subtractedValue) public returns(bool)",
        "function _mint(address account, uint256 amount)",
        "function _burn(address account, uint256 amount)",
        "function _burnFrom(address account, uint256 amount)",
        "function paymentHandlerCancelled(address cust, uint price)",
        "function paymentHandlerDelayed(address cust, uint dist)",
        "function insertPayment(string _amount, address addr, string timestamp)",
        "function searchPayments(uint length) public view returns(string memory, address[] memory, address[] memory, string memory)",

        // events
        "event PaymentRefunded(address from, address to, uint amount)",
        "event DelayRefunded(address from, address to, uint amount)",
        "event NewPaymentInsert(uint amount, address from, address to, uint timestamp)"
    ];

    inventory_ADDR = "0x5ea9441d227CD83e9c98EEA571E94F5bdda1dED9";
    inventory_ABI = [
        // functions
        "function createInventory(string memory cid, string memory flightNumber, uint month, uint day, uint seats )",
        "function searchInventory(string memory flightNumber, uint month, uint day) public view returns(uint, uint, string)",
        "function searchFlights(uint month, uint day) public view returns(string)",
        "function flightBooked(uint index) public returns (bool)",
        "function flightTicketCancelled(string memory flightNo, uint month, uint day) public",
        "function compareStrings (string memory cmp1, string memory cmp2) private pure returns(bool)",

        // events
        "event FlightBooked(string flightNumber, uint month, uint day)",
        "event InventoryCreated(string flightNumber, uint month, uint day)"
    ];

    pss_ADDR = "0x6b130A3a87973Da21DE3E9f0fc14fD983A26Cbad";
    pss_ABI = [
        "function createTicket(string memory cid, string memory flightNumber, uint month, uint day, uint256 price) public returns(bool)",
        "function changeFlightStatus(string memory flightNumber, uint month, uint day, uint _status) public returns(bool, uint)",
        "function getFlightStatus(string memory flightNumber, uint month, uint day) public view returns(string) ",
        "function getPassengerStatus(address addr, string memory flightNumber, uint month, uint day) public view returns(string) ",
        "function getPassengerList(string memory flightNumber, uint month, uint day) public view returns(address[] memory)",
        "function getTickets() public view returns(string)",
        "function changePassengerStatus(uint _status, string memory flightNumber, uint month, uint day) public returns(bool) ",
        "function getTicketPrice(address addr, string memory flightNumber, uint month, uint day) public view returns(uint)",
        "function compareStrings (string memory cmp1, string memory cmp2) private pure returns(bool)",
        "function concatStrings(string[] memory cids)",

        // events
         "event TicketIssued(address customer, string flightNumber, uint month, uint day)",
         "event TicketCancelled(address customer, uint price)",
         "event FlightCreated(string flightNumber, uint month, uint day)",
         "event FlightStatusChanged(string flightNumber, uint month, uint day, uint status)",
         "event PassengerStatusChanged(address customer, string flightNumber, uint month, uint day, uint status)"
    ];

    getFlightPlanAddr() { return this.flightPlan_ADDR }
    getFlightPlanAbi() { return this.flightPlan_ABI }

    getFlightTokenAddr() { return this.flightToken_ADDR; }
    getFlightTokenAbi() { return this.flightToken_ABI}

    getInventoryAddr() { return this.inventory_ADDR; }
    getInventoryAbi() { return this.inventory_ABI; }

    getPssAddr() { return this.pss_ADDR; }
    getPssAbi() { return this.pss_ABI; }
}
