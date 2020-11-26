export class Backend {

    flightNumber = "";
    dep = "";
    arr = "";
    depTime= "";
    arrTime= "";
    opDays = [];
    date = new Object();
    flightTime = "";

    search_dep = "";
    search_arr = "";
    search_depTime = [];
    search_arrTime = [];
    search_flightTime = [];
    search_flightNumber = [];
    sOpDays = new Map();
    sPrices = new Map();
    arrIndex = 0;


    cleanAllValues() {
        this.search_depTime=[];
        this.search_flightNumber=[];
        this.search_dep="";
        this.search_arrTime=[];
        this.search_arr="";
        this.search_opDays=[];
        this.search_flightTime=[];
    }


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

    setSearchFlightTime(param) { this.search_flightTime.push(param)}
    getSearchFlightTime(para) { return this.search_flightTime[para] }

    setSearchOpDay(param) { this.search_opDays.push(param) }
    getSearchOpDay(param) { return this.search_opDays[param] }

    setSearchPrice(param) { this.search_prices.push(param)}
    getSearchPrice(param) { this.search_prices[param]}

    setSearchOpDay(param) { 
        this.sOpDays.set(this.arrIndex, param);
        console.log("setSearchOpDay ", this.sOpDays);
     }
    getSearchOpDay(param) { 
        console.log("getSearchOpDay ", this.sOpDays[param]);
        return this.sOpDays.get(param);
    }

    setSearchPrice(param) {
        this.sPrices.set(this.arrIndex, param);
        this.arrIndex+=1;
        console.log("setSearchOpDay ", this.sPrices);
    }
    getSearchPrice(param) { 
        var buf = this.sPrices.get(param);
        var op = this.sOpDays.get(param);
        var i = 0;
        var day = new Date(this.date.timestamp).getUTCDay();
        if(day == 0) { day = 7 } 
        for(;i<op.length;i++) {
            if(day == op[i]) { break; }
        }
        console.log(this.sPrices);
        console.log("Buf: ", buf);
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