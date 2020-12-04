export class Backend {

    flightNumber = "";
    dep = "";
    arr = "";
    depTime= "";
    arrTime= "";
    opDays = [];
    day=0;
    date = new Object();
    flightTime = "";

    search_dep = "";
    search_arr = "";
    search_depTime = [];
    search_arrTime = [];
    sFlightTime = [];
    search_flightNumber = [];
    search_opDays = new Map();
    sPrices = new Map();
    arrIndex = 0;

    myFlights = [];
    myName = [];
    myBDate = [];
    mySurname = [];
    myFrom = [];
    myTo = [];
    myDepTime = [];
    myArrTime = [];
    myFlightDate = [];
    myPassengerStatus = [];
    myFlightStatus = [];
    myPrice = [];
    myPriceTaxes = [];
    detailsIndex = 0;

    setMyFlight(param) { this.myFlights.push(param)}
    getMyFlight(param) { return this.myFlights[param]}

    setMyName(param) { this.myName.push(param)}
    getMyName(param) { return this.myName[param]}

    setMySurname(param) { this.mySurname.push(param)}
    getMySurname(param) { return this.mySurname[param]}

    setMyBDate(param) { this.myBDate.push(param)}
    getMyBdate(param) { return this.myBDate[param]}

    setMyFrom(param) { this.myFrom.push(param)}
    getMyFrom(param) { return this.myFrom[param]}

    setMyTo(param) { this.myTo.push(param)}
    getMyTo(param) { return this.myTo[param]}

    setMyDepTime(param) { this.myDepTime.push(param)}
    getMyDepTime(param) { return this.myDepTime[param]}

    setMyArrTime(param) { this.myArrTime.push(param)}
    getMyArrTime(param) { return this.myArrTime[param]}

    setMyFlightDate(param) { this.myFlightDate.push(param)}
    getMyFlightDate(param) { return this.myFlightDate[param]}

    setMyPassengerStatus(param) { this.myPassengerStatus.push(param)}
    getMyPassengerStatus(param) { return this.myPassengerStatus[param]}

    setMyFlightStatus(param) { this.myFlightStatus.push(param)}
    getMyFlightStatus(param) { return this.myFlightStatus[param]}

    setMyPrice(param) { this.myPrice.push(param)}
    getMyPrice(param) { return this.myPrice[param]}

    setMyPriceTaxes(param) { this.myPriceTaxes.push(param)}
    getMyPriceTaxes(param) { return this.myPriceTaxes[param]}

    setDetailsIndex(param) { this.detailsIndex=param }
    getDetailsIndex() { return this.detailsIndex }

    cleanMyValues() {
        this.myFlights = [];
        this.myName = [];
        this.mySurname = [];
        this.myFrom = [];
        this.myTo = [];
        this.myDepTime = [];
        this.myArrTime = [];
        this.myFlightDate = [];
        this.myPassengerStatus=[];
        this.myFlightStatus = [];
    }

    getMyArrayLength() {
        var ind = 0;
        var retArr = [];

        for(; ind<this.myDepTime.length; ) {
            retArr.push(ind++)
        }

        return retArr;
    }

    bookingIndex = 0;
    bookingCID = "";
    indexForFlightBooking=0;

    /**
     * search_dep = "";
    search_arr = "";
    search_depTime = [];
    search_arrTime = [];
    sFlightTime = [];
    search_flightNumber = [];
    search_opDays = new Map();
    sPrices = new Map();
    arrIndex = 0;
     */

    clearSearchParams() {
        this.search_dep="";
        this.search_arr="";
        this.search_depTime = [];
        this.search_arrTime = [];
        this.sFlightTime = [];
        this.search_flightNumber = [];
        this.search_opDays = new Map();
        this.sPrices = new Map();
        this.arrIndex = 0;
    }

    cleanAllValues() {
        this.search_depTime=[];
        this.search_flightNumber=[];
        this.search_dep="";
        this.search_arrTime=[];
        this.search_arr="";
        this.search_opDays=new Map();
        this.search_flightTime=new Map();
        this.sPrices = new Map();
        this.arrIndex = 0;
    }


    setBookingIndex(param) { this.bookingIndex = param}
    getBookingIndex() { return this.bookingIndex}

    setBookingCID(param) { this.bookingCID = param}
    getBookingCID() { return this.bookingCID }


    setIndexforFlightBooking(param) { this.indexForFlightBooking = param}
    getIndexforFlightBooking() { return this.indexForFlightBooking}


    setDate(param) { this.date = param; }
    getDate() { return this.date}

    setFlightNumber(param) { this.flightNumber = param}
    getFlightNumber() { return this.flightNumber }

    setDep(param) { this.dep = param }
    getDep(){ return this.dep }

    setArr(param) { this.arr = param }
    getArr(){ return this.arr }

    setDepTime(param) { this.depTime = param }
    getDepTime() { return this.depTime }

    setOpDay(param) { this.opDays = param}
    getOpDay() { return this.opDays }

    setArrTime(param) { this.arrTime = param}
    getArrTime() { return this.arrTime }

    setFlightTime(param) { this.flightTime = param}
    getFlightTime() { return this.flightTime }

    setDay(param) { this.day=param}
    getDay() { return this.day}



    setSearchDep(param) { this.searchDep = param }
    getSearchDep() { return this.searchDep }

    setSearchArr(param) { this.searchArr = param }
    getSearchArr() { return this.searchArr }

    setSearchDepTime(param) { this.search_depTime.push(param) }
    getSearchDepTime(param) { return this.search_depTime[param]}

    setSearchArrTime(param) { this.search_arrTime.push(param) }
    getSearchArrTime(param) { return this.search_arrTime[param] }

    setSearchFlightNumber(param) { this.search_flightNumber.push(param)}
    getSearchFlightNumber(param) { return this.search_flightNumber[param] }

    setSearchFlightTime(param) { this.sFlightTime.push(param) }
    getSearchFlightTime(para) { return this.sFlightTime[para] }

    setSearchOpDay(param) { 
        this.search_opDays.set(this.arrIndex, param);
        console.log("setSearchOpDay ", this.search_opDays);
     }
    getSearchOpDay(param) { 
        console.log("getSearchOpDay ", this.search_opDays[param]);
        return this.search_opDays.get(param);
    }

    setSearchPrice(param) {
        this.sPrices.set(this.arrIndex, param);
        this.arrIndex+=1;
        console.log("setSearchOpDay ", this.sPrices);
    }
    getSearchPrice(param) { 
        buf = this.sPrices.get(param)
        op = this.search_opDays.get(param);
        var i = 0;
        for(;i<op.length;i++) {
            if(this.day == op[i]) { break; }
        }
        return buf[i];
    }

    getQueryArr() {
        var ind = 0;
        var retArr = [];

        for(; ind<this.search_depTime.length; ) {
            retArr.push(ind++)
        }

        return retArr;
    }
}
