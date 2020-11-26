import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, FlatList, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import { flightStatus } from './utils/Status/flightStatus';
import { passengerStatus } from './utils/Status/passengerStatus';
import { Picker } from '@react-native-picker/picker';
import { MyStyles } from './styles/myStyles';
import { Backend } from './utils/backend';
import { WalletUtiils, WalletMethods } from './utils/walletUtils';
import { MyContracts } from './utils/myContracts';
import { setJSON, getJSON } from './utils/IPFS';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-calendars';
import Dialog, { DialogButton, DialogContent, DialogFooter } from 'react-native-popup-dialog';
import { Contracts } from './utils/walletUtils';


/** 
 * @param mBackend has all flight relevant data to submit
 * @param _walletUtils WalletUtils contents wallet data for interaction with blockchain
 * @param _styles custom styles
 * @param projectID Infura Project ID
 * @param provider infura node required for communication with the blockchain
 * @param contracts smart contract instances
 * @param WalletMethods access to wallet functions
 * @param tokens represents the amount of the tokens the airline has
 * @param flyTokenContract FlyToken smart contract instance
 * @param flightPlanContract OperationsPlan smart contract instance
 * @param signer Wallet to sign and do transactions
*/
const mBackend = new Backend();
const _walletUtils = new WalletUtiils();
const _styles = new MyStyles();
const projectID = "0211650106d841af86d75c8707e6e87b";
const provider = new ethers.providers.InfuraProvider("rinkeby", projectID);
const contracts = new MyContracts();
const funcContracts = new Contracts();
const fStatus = flightStatus;
var dataListToShow = [];
var tokens = 0;
var _walletMethods;
var signer;
var pickedAirports = {
  pickedDep: '',
  pickedArr: ''
}


const SearchingGif = () => {
  return(
    <Image source={require("./assets/searching.gif")} style={{ width:200, height:200 }} />
  )
}

const hexToDec = (hex) => {
  var result = parseInt(hex, 16);
  console.log("Result token, ", result);
  return result;
}


const DepPicker = () => {
  const [ airp, setAirp ] = useState("ADB");

  return (
    <View style={{borderWidth: 2, borderColor: "blue"}}>
    <Picker
      selectedValue={airp}
      style={{height:40, width: 300}}
      onValueChange={(itemVal, itemInd) => {
        pickedAirports.pickedDep=itemVal;
        setAirp(itemVal);
        console.log("Dep Airport: ", pickedAirports.pickedDep)}}
      mode="dropdown"
      >
      <Picker.Item label="Frankfurt am Main" value="FRA" />
      <Picker.Item label="Izmir" value="ADB" />
      <Picker.Item label="Zurich" value="ZRH" />
      <Picker.Item label="Stuttgart" value="STR" />
      <Picker.Item label="Munich" value="MUC" />
    </Picker>
  </View>
  )
}

const ArrPicker = () => {
  const [ airp, setAirp ] = useState("ADB");
  return (
    <View style={{borderWidth: 2, borderColor: "blue"}}>
    <Picker
      selectedValue={airp}
      style={{height:40, width: 300}}
      onValueChange={(itemVal, itemInd) => {
        pickedAirports.pickedArr=itemVal;
        setAirp(itemVal);
        console.log("Arr Airport: ", pickedAirports.pickedArr);
      }}>
      <Picker.Item label="Frankfurt am Main" value="FRA" />
      <Picker.Item label="Izmir" value="ADB" />
      <Picker.Item label="Zurich" value="ZRH" />
      <Picker.Item label="Stuttgart" value="STR" />
      <Picker.Item label="Munich" value="MUC" />
    </Picker>
    </View>
  )
}



// homescreen
const StartScreen = ({ navigation }) => {

  const [ address, setAddress ] = useState('');
  const [ hide, setHide ] = useState(false);
  const [ walletDialog, setWalletDialog ] = useState(false);
  const [ show, setShow ] = useState(true);
  const [ dialogText, setDialogText ] = useState("Calculating Wallet Parameters...")

  const setWalletParams = () => {
    _walletUtils.setParams();
    setAddress(_walletUtils.getAddress());
    _walletMethods = new WalletMethods(_walletUtils.getPrivateKey(), provider);
    setDialogText("Setting up Wallet...")
    signer = _walletMethods.getWallet();
    createContracts();
    setHide(!hide); 
  }

  const createContracts = () => {

    setDialogText("Creating Contracts...")

    funcContracts.setFlightToken(_walletMethods.createContractInstance(
      contracts.getFlightTokenAddr(), 
      contracts.getFlightTokenAbi(), 
      signer));

    funcContracts.setFlightPlanContract(_walletMethods.createContractInstance(
      contracts.getFlightPlanAddr(), 
      contracts.getFlightPlanAbi(), 
      signer));

    funcContracts.setPssInstance(_walletMethods.createContractInstance(
      contracts.getPssAddr(),
      contracts.getPssAbi(),
      signer));

    funcContracts.setInvContract(_walletMethods.createContractInstance(
      contracts.getInventoryAddr(),
      contracts.getInventoryAbi(),
      signer));

    funcContracts.getFlightToken().balanceOf(address).then(res => {tokens = parseInt(Object.values(res)[0], 16)})
    //funcContracts.getPssInstance().on("TicketCancelled", (res) => {console.log("A ticket is cancelled: ", res)}); // if a ticket is cancelled auto transfer the payment to the address

    setWalletDialog(false);
    setShow(false);

  }


  return (
    <ScrollView style={{backgroundColor: "white"}}>
      <View style={_styles.styles.container}>
        {show?<View style={{ alignItems: "center"}} hidden>
          <Text style={{color: "blue", fontSize: 30,}}>Welcome to AirlinesOracle</Text>
          <Text style={{color: "blue", fontSize: 20, marginTop: 20}}>Please login</Text>
          <Text   style={{ fontSize: 15, 
                textAlign: "center", margin: 5}} hidden={hide}>Enter your Mnemonic 15 words: </Text>

          <TextInput  onChangeText={ (value) => {_walletUtils.setMnemonic(value);} } 
                    style={_styles.styles.textInputBox}
                    hidden={hide}/>

          <TouchableOpacity style={{width: 300, height:40, margin:10, backgroundColor: '#000F64'}}
                          onPress={ () => { 
                            setWalletDialog(true);
                            setTimeout(() => {setWalletParams()}, 1000); }} hidden={hide}>
            <Text style={{color:"#fff", fontSize: 15, textAlign: "center", margin: 10}}>LOGIN</Text>
          </TouchableOpacity>
        </View>:null}

        {!show?<Text style={{textAlign: "center", fontSize: 14, color: "blue", marginBottom: 10}}>Your address: { address }</Text>:null}

        <Dialog visible={walletDialog}>
          <DialogContent>
            <Text>{dialogText}</Text>
          </DialogContent>
        </Dialog>
        
          {!show?<Text style={{color: "blue", fontSize: 25, marginTop:30}}>MENU</Text>: null }

        {!show?<TouchableOpacity style={{width: 300, height:50, backgroundColor: '#000F64', margin: 5}}
                          onPress={() => navigation.navigate('Create new Flight')}
                          disabled={ _walletUtils.getAddress() === "" }>

            <Text style={{color:"#fff", fontSize: 20, textAlign: "center", margin: 10}}>Add new flight</Text>

        </TouchableOpacity>:null}

        {!show?<TouchableOpacity style={{width: 300, height:50, backgroundColor: '#000F64', margin: 5}}
                          onPress={() => navigation.navigate('Search for Flight')}
                          disabled={ _walletUtils.getAddress() === "" }>

            <Text style={{color:"#fff", fontSize: 20, textAlign: "center", margin: 10}}>Create Inventory</Text>
        </TouchableOpacity>:null}

        {!show?<TouchableOpacity style={{width: 300, height:50, backgroundColor: '#000F64', margin: 5}}
                          onPress={() => navigation.navigate('Flight Control Center')}
                          disabled={ _walletUtils.getAddress() === "" }>

            <Text style={{color:"#fff", fontSize: 20, textAlign: "center", margin: 10}}>Update Flight Status</Text>
        </TouchableOpacity>:null}
        
        {!show?<TouchableOpacity style={{width: 300, height:50, backgroundColor: '#000F64', margin: 5}}
                          onPress={() => navigation.navigate('Token Portal')}
                          disabled={ _walletUtils.getAddress() === "" }>

            <Text style={{color:"#fff", fontSize: 20, textAlign: "center", margin: 10}}>FLY Token Portal</Text>
        </TouchableOpacity>:null}
        </View>
      </ScrollView>
  );
}


const TicketCancelledEventOccures = () => {

}


// create new flights - screen
const AddFlightScreen = () => {

  const [ addingFlightDialog, setAddingFlightDialog ] = useState(false);
  const [ addDialog, setAddDialog ] = useState(false);
  const [ dialogText, setDialogText ] = useState("");

  // bool -> selected or not // float -> price
  const [monday, setMonday] = useState([false, "black", "white", 0]);
  const [tuesday, setTuesday] = useState([false, "black", "white", 0]);
  const [wednesday, setWednesday] = useState([false, "black", "white", 0]);
  const [thursday, setThursday] = useState([false, "black", "white", 0]);
  const [friday, setFriday] = useState([false, "black", "white", 0]);
  const [saturday, setSaturday] = useState([false, "black", "white", 0]);
  const [sunday, setSunday] = useState([false, "black", "white", 0]);

  console.log("Test monday: ", monday);
  console.log("Test monday 4th elem: ", monday[3]);


  const issue = () => {
    
    const arrOpDay = [];
    const arrPrices = [];

    if(monday[0]) { arrOpDay.push(1); arrPrices.push(monday[3]) }
    if(tuesday[0]) { arrOpDay.push(2); arrPrices.push(tuesday[3]) }
    if(wednesday[0]) { arrOpDay.push(3); arrPrices.push(wednesday[3]) }
    if(thursday[0]) { arrOpDay.push(4); arrPrices.push(thursday[3]) }
    if(friday[0]) { arrOpDay.push(5); arrPrices.push(friday[3]) }
    if(saturday[0]) { arrOpDay.push(6); arrPrices.push(saturday[3]) }
    if(sunday[0]) { arrOpDay.push(7); arrPrices.push(sunday[3]) }

    if(arrOpDay.length > 0){
      var checker = true;
      for(var ind = 0; ind<arrPrices.length; ind++) {
        if(arrPrices[ind] == 0) {checker = false}
        console.log("Buf: ", arrPrices[ind])
        console.log("Price: ", arrPrices)
      }

      if(checker){

        const _cid = setJSON({ 
          "departure": pickedAirports.pickedDep, 
          "arrival": pickedAirports.pickedArr,
          "flightNumber": mBackend.getFlightNumber(),
          "depTime": mBackend.getDepTime(),
          "arrTime": mBackend.getArrTime(),
          "flightDuration": mBackend.getFlightTime(),
          "opDays": arrOpDay,
          "prices": arrPrices,
          "operator": "Luchshanse Airlines"
        });

        const res = funcContracts.getFlightPlanContract().issueFlight(pickedAirports.pickedDep, pickedAirports.pickedArr, 1, _cid)
                              .then (response => {  setAddingFlightDialog(false); 
                                                    setDialogText("Flight added to flightplan!"); 
                                                    setAddDialog(true);
                                                  })
                             .catch(err => alert(err.message));

        console.log("Result: ", res);
      } else { 
        setAddingFlightDialog(false); 
        setDialogText("You selected a day but no price detected. '\n Please check your data!"); 
        setAddDialog(true); }
    } else { setAddingFlightDialog(false); setDialogText("No Days selected!"); setAddDialog(true); }
  }

/**
 * 
 * <TextInput style={_styles.styles.textInputBox} 
                  onChangeText={ (value) => { mBackend.setDep(value) }}/>

                  <TextInput style={_styles.styles.textInputBox} 
                  onChangeText={ (value) => { mBackend.setArr(value) }}/>
 */

  return (
    <ScrollView>
    <View style={_styles.styles.containerFlightScreen}>

      <Text style={_styles.styles.searchLabelText}>Flightnumber</Text>
      <TextInput  style={_styles.styles.textInputBox}
                  onChangeText={ (value) => { mBackend.setFlightNumber(value) }}/>

      <Text style={_styles.styles.searchLabelText}>From</Text>
      <DepPicker/>

      <Text style={_styles.styles.searchLabelText}>To</Text>
      <ArrPicker/>

      <Text style={_styles.styles.searchLabelText}>Departure time</Text>
      <TextInput style={_styles.styles.textInputBox} 
                  onChangeText={ (value) => { mBackend.setDepTime(value) }}/>

      <Text style={_styles.styles.searchLabelText}>Arrival time</Text>
      <TextInput style={_styles.styles.textInputBox} 
                  onChangeText={ (value) => { mBackend.setArrTime(value) }}/>

      <Text style={_styles.styles.searchLabelText}>Duration</Text>
      <TextInput style={_styles.styles.textInputBox} 
                  onChangeText={ (value) => { mBackend.setFlightTime(value) }}/>


      <Text style={_styles.styles.searchLabelText}>Set Days and Prices</Text>
      
      <Dialog visible={addingFlightDialog}>
        <DialogContent>
          <Text>Adding Flight...</Text>
        </DialogContent>
      </Dialog>

      <Dialog visible={addDialog}
              footer={
                <DialogFooter>
                  <DialogButton text="OK" onPress={() => setAddDialog(false)}/>
                </DialogFooter>
              }>
        <DialogContent>
          <Text>{dialogText}</Text>
        </DialogContent>
      </Dialog>

      <View style={{ flex:1, flexDirection: "row", marginBottom:5 }}>
        <TouchableOpacity style={{ backgroundColor: monday[2], width: 100, height:30 }} 
                          onPress={() => {if(monday[0]) setMonday([false, "black", "white", monday[3]]); else setMonday([true, "white", "blue", monday[3]]);}}>
            <Text style={{ color: monday[1], textAlign: "center", margin: 5, fontSize: 16}}>Monday</Text>
        </TouchableOpacity>
        <TextInput  style={{borderColor: 'blue', borderWidth: 2, width: 150, height: 30, textAlign: "center"}}
                  onChangeText={ (value) => setMonday([monday[0], monday[1], monday[2], parseFloat(value)])} placeholder="Price (amount in FLY)"/>
      </View>

      <View style={{ flex:1, flexDirection: "row", marginBottom:5 }}>
        <TouchableOpacity style={{ backgroundColor: tuesday[2], width: 100, height:30 }}
                          onPress={() => {if(tuesday[0]) setTuesday([false, "black", "white", tuesday[3]]); else setTuesday([true, "white", "blue", tuesday[3]]);}}>
          <Text style={{ color: tuesday[1], textAlign: "center", margin: 5, fontSize: 16}}>Tuesday</Text>
        </TouchableOpacity>
        <TextInput  style={{borderColor: 'blue', borderWidth: 2, width: 150, height: 30, textAlign: "center"}}
                  onChangeText={ (value) => setTuesday([tuesday[0], tuesday[1], tuesday[2], parseFloat(value)])} placeholder="Price (amount in FLY)"/>
      </View>

      <View style={{ flex:1, flexDirection: "row",marginBottom:5 }}>
        <TouchableOpacity style={{ backgroundColor: wednesday[2], width: 100, height:30 }}
                          onPress={() => {if(wednesday[0]) setWednesday([false, "black", "white", wednesday[3]]); else setWednesday([true, "white", "blue", wednesday[3]]); }}>
          <Text style={{ color: wednesday[1], textAlign: "center", margin: 5, fontSize: 16}}>Wednesday</Text>
        </TouchableOpacity>
        <TextInput  style={{borderColor: 'blue', borderWidth: 2, width: 150, height: 30, textAlign: "center"}}
                  onChangeText={ (value) => setWednesday([wednesday[0], wednesday[1], wednesday[2], parseFloat(value)])} placeholder="Price (amount in FLY)"/>
      </View>

      <View style={{ flex:1, flexDirection: "row",marginBottom:5 }}>
        <TouchableOpacity style={{ backgroundColor: thursday[2], width: 100, height:30 }}
                          onPress={() => {if(thursday[0]) setThursday([false, "black", "white", thursday[3]]); else setThursday([true, "white", "blue", thursday[3]]); }}>
          <Text style={{ color: thursday[1], textAlign: "center", margin: 5, fontSize: 16}}>Thursday</Text>
        </TouchableOpacity>
        <TextInput  style={{borderColor: 'blue', borderWidth: 2, width: 150, height: 30, textAlign: "center"}}
                  onChangeText={ (value) => setThursday([thursday[0], thursday[1], thursday[2], parseFloat(value)])} placeholder="Price (amount in FLY)"/>
      </View>

      <View style={{ flex:1, flexDirection: "row",marginBottom:5 }}>
        <TouchableOpacity style={{ backgroundColor: friday[2], width: 100, height:30 }}
                          onPress={() => {if(friday[0]) setFriday([false, "black", "white", friday[3]]); else setFriday([true, "white", "blue", friday[3]]);}}>
          <Text style={{ color: friday[1], textAlign: "center", margin: 5, fontSize: 16}}>Friday</Text>
        </TouchableOpacity>
        <TextInput  style={{borderColor: 'blue', borderWidth: 2, width: 150, height: 30, textAlign: "center"}}
                  onChangeText={ (value) => setFriday([friday[0], friday[1], friday[2], parseFloat(value)])} placeholder="Price (amount in FLY)"/>
      </View>

      <View style={{ flex:1, flexDirection: "row",marginBottom:5 }}>
        <TouchableOpacity style={{ backgroundColor: saturday[2], width: 100, height:30 }}
                          onPress={() => {if(saturday[0]) setSaturday([false, "black", "white", saturday[3]]); else setSaturday([true, "white", "blue", saturday[3]]);}}>
          <Text style={{ color: saturday[1], textAlign: "center", margin: 5, fontSize: 16}}>Saturday</Text>
        </TouchableOpacity>
        <TextInput  style={{borderColor: 'blue', borderWidth: 2, width: 150, height: 30, textAlign: "center"}}
                  onChangeText={ (value) => setSaturday([saturday[0], saturday[1], saturday[2], parseFloat(value)])} placeholder="Price (amount in FLY)"/>
      </View>

      <View style={{ flex:1, flexDirection: "row",marginBottom:5 }}>
        <TouchableOpacity style={{ backgroundColor: sunday[2], width: 100, height:30 }}
                          onPress={() => {if(sunday[0]) setSunday([false, "black", "white", sunday[3]]); else setSunday([true, "white", "blue", sunday[3]]);}}>
          <Text style={{ color: sunday[1], textAlign: "center", margin: 5, fontSize: 16}}>Sunday</Text>
        </TouchableOpacity>
        <TextInput  style={{borderColor: 'blue', borderWidth: 2, width: 150, height: 30, textAlign: "center"}}
                  onChangeText={ (value) => setSunday([sunday[0], sunday[1], sunday[2], parseFloat(value)])} placeholder="Price (amount in FLY)"/>
      </View>

      <TouchableOpacity
            style={{width: 200, height:40, margin:10, backgroundColor: '#000F64'}}
            onPress={ () => { setAddingFlightDialog(true); issue(); }}>
            <Text style={{color:"#fff", fontSize: 15, 
                          textAlign: "center", margin: 10}}>Save Flight</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>
  );
}


// search for flights
const SearchFlightScreen = ({ navigation }) => {

  const [ showSearchingGif, setShowSearchingGif ] = useState(false);
  const [ showAlertDialog, setShowAlertDialog ] = useState(false);
  const [ alertText, setAlertText ] = useState("");

  const onChange = (value) => {
    mBackend.setDate(value);
  }

  
  const issue = async () => {

    // clean search vals for new search
    mBackend.cleanAllValues();

    console.log("Dep: ", pickedAirports.pickedDep, " Arr: ", pickedAirports.pickedArr);

    funcContracts.getFlightPlanContract()
    .searchFlight(pickedAirports.pickedDep, pickedAirports.pickedArr)
    .then( (response) => {
      console.log(response);
      handleResult(response)
    })      
    .catch( err => {
      setAlertText("No Flights found for your Route!")
      setShowSearchingGif(false)
      setShowAlertDialog(true);
    })
  }
    

  const handleResult = async (result) => {
  
    if(result == "") {
      setAlertText("No Flights found for your Route!"); 
      setShowSearchingGif(false);
      setShowAlertDialog(true);
    }

    else{
      /**  
       * @param splitResult split the cids divide by underline and save as array
       * @param ipfsData gets JSON from ipfs and saves data for later access
       * @param daysOperated get operation weekdays for comparison with search day
       * @param daySearched get weekday and look if there is a match with daysOperated,
       *                    if so show the flight as result
      */
      const splitResult = result.split("_");
      var ipfsData = await getJSON(splitResult[0]);
      var daysOperated = ipfsData["opDays"];
      var daySearched = (new Date(mBackend.getDate().timestamp)).getUTCDay();


      /**
       * console logs
       */
      console.log("Length of splitResult: ", splitResult.length);
      console.log(ipfsData);
      console.log("Days: ", daysOperated.length);
      console.log("daySearched: ", daySearched);


      if(daySearched == 0) { daySearched=7 } 

      // check if route is operated on selected date
      // to do this, check if days match, if so insert into backend.js instance
      for(var i = 0; i<daysOperated.length; i++) {
        if(daySearched == daysOperated[i]) {
          mBackend.setSearchDep(ipfsData["departure"]);
          mBackend.setSearchArr(ipfsData["arrival"]);
          mBackend.setSearchFlightNumber(ipfsData["flightNumber"]);
          mBackend.setSearchDepTime(ipfsData["depTime"]);
          mBackend.setSearchArrTime(ipfsData["arrTime"]);
          mBackend.setSearchFlightTime(ipfsData["flightDuration"]);      
          mBackend.setSearchOpDay(ipfsData["opDays"]);
          mBackend.setSearchPrice(ipfsData["prices"]);
        }
      }

      // if there are more than one planned flight for the route
      if(splitResult.length>1){
        for(var ind = 1; ind < splitResult.length; ind++) {
          
          ipfsData = await getJSON(splitResult[ind]);
          
          daysOperated = ipfsData["opDays"];

          for(var i = 0; i<daysOperated.length; i++) {
            if(daySearched == daysOperated[i]) {
              mBackend.setSearchFlightNumber(ipfsData["flightNumber"]);
              mBackend.setSearchDepTime(ipfsData["depTime"]);
              mBackend.setSearchArrTime(ipfsData["arrTime"]);
              mBackend.setSearchFlightTime(ipfsData["flightDuration"]);
              mBackend.setSearchOpDay(ipfsData["opDays"]);
              mBackend.setSearchPrice(ipfsData["prices"]);
            }
          }
        }
      }

      if(mBackend.getQueryArr().length == 0) {
        setAlertText("No flights found for your selected date");
        setShowSearchingGif(false);
        setShowAlertDialog(true);
      }
      else {
        setShowSearchingGif(false);
        navigation.navigate('Flight Results');
      }
    }
  }

  return (
    <ScrollView>
    <View style={_styles.styles.containerFlightScreen}>

      <Text style={_styles.styles.searchLabelText}>From</Text>
      <DepPicker/>
      
      <Text style={_styles.styles.searchLabelText}>To</Text>
      <ArrPicker/>

      <Dialog visible={showAlertDialog}
              footer={
                <DialogFooter>
                  <DialogButton text="OK" onPress={() => {setShowAlertDialog(false)}} />
                </DialogFooter>
              }>
        <DialogContent> 
          <Text>No flights found for your selected date</Text>
        </DialogContent>
      </Dialog>

      <Dialog visible={showSearchingGif}>
        <DialogContent> 
          <SearchingGif />
        </DialogContent>
      </Dialog>

      <View style={{ marginTop: 20 }}>
        <Text>Select Date</Text>
        <Calendar theme={{selectedDayTextColor: "white", selectedDayBackgroundColor: "blue", todayTextColor: "red"}}
                onDayPress={(dateObject) => {onChange(dateObject)}} enableSwipeMonths={true}/>
      </View>

      <TouchableOpacity
            style={{width: 200, height:55, margin:10, backgroundColor: '#000F64'}}
            onPress={ () => { setShowSearchingGif(true); issue();} }>
            <Text style={{color:"#fff", fontSize: 15, 
                          textAlign: "center", margin: 10}}>Search and Create new Inventory</Text> 
        </TouchableOpacity>

    </View>
    </ScrollView>
  );
}


// ind is the index of flightresults array
var ind = 0;

// show the results
const FlightResultsScreen = ({ navigation }) => {

  const array = mBackend.getQueryArr();

  const onPressHandler = (index) => {
    ind=index;

    console.log("Index: ", index);

    navigation.navigate('Create new Inventory');
  }

  return (
    <ScrollView>
    <View style={_styles.styles.containerFlightScreen}>

      <Text style={{ color: "blue", fontSize: 16, marginTop:10, marginBottom: 10 }}>
        Flights for {pickedAirports.pickedDep} -{'>'} {pickedAirports.pickedArr} 
      </Text>

      <View style={{ maxHeight:30, width: 350 , flex: 1, flexDirection: "row", 
                                 borderColor: "blue", borderWidth: 1, borderRadius: 2}}>
        
        <Text style={{ margin: 5, fontStyle: "italic"}}> FLIGHTNUMBER </Text>
        <Text style={{ marginLeft: 2, marginRight: 2, marginTop: 5, fontStyle: "italic"}}> DEP TIME </Text>
        <Text style={{ marginLeft: 2, marginRight: 2, marginTop: 5, fontStyle: "italic"}}> ARR TIME </Text>
        <Text style={{ margin: 5, fontStyle: "italic"}}> FLIGHTTIME </Text>
      </View>
      {array.map(arr => (
      <TouchableOpacity key={arr} style={{ maxHeight:60, width: 350 , flex: 1, flexDirection: "row", 
                                 borderColor: "blue", borderWidth: 1, borderRadius: 2}}
                                 onPress={() => {onPressHandler(arr)}}>
                                   
          <Text style={{ margin: 20, textAlign: "center"}}>{ mBackend.getSearchFlightNumber(arr)}   </Text>
          <Text style={{ margin: 20, textAlign: "center"}}>{ mBackend.getSearchDepTime(arr) }h  </Text>
          <Text style={{ margin: 20, textAlign: "center"}}>{ mBackend.getSearchArrTime(arr) }h  </Text>
          <Text style={{ marginTop: 20, marginLeft:15, marginRight:15, textAlign: "center"}}>{ mBackend.getSearchFlightTime(arr) } </Text>
        
      </TouchableOpacity>
      ))}
    </View>
    </ScrollView>
  );
}


// look for balances
const TokenPortalScreen = () => {

  var dataToDisplayAsList = [];
  const [ claimDialog, setClaimDialog ] = useState(false);

  // each item is displayed in flatlist with this view
  const itemView = () => {
    <View>
      <Text>{dataToDisplayAsList.address}</Text>
      <Text>{dataToDisplayAsList.amount}</Text>
      <Text>{dataToDisplayAsList.timeDate}</Text>
    </View>
  }

  // get the payments from the contract
  const getPayments = () => {
    funcContracts.getFlightToken().searchPayments()
      .then(res => { console.log("getPayments: ", res); handlePayments(res); })
  }

  console.log("Token Address: ", _walletUtils.getAddress());

  // mint new tokens
  const claimTokens = () => {
    funcContracts.getFlightToken()._mint(_walletUtils.getAddress(), 1000000)
              .then(() => {console.log("1'000'000 tokens added to your account"); setClaimDialog(true); getTotalSupply();})
              .catch(err => {console.log("Error: ", err);  alert(err)});
  }

  setTimeout(() => {funcContracts.getFlightToken().balanceOf(_walletUtils.getAddress())
    .then(res => { console.log(Object.values(res)[0]); tokens = parseInt(Object.values(res)[0], 16); })}, 1000);

  getPayments();

  // get total amount of tokens
  const getTotalSupply = () => {
    funcContracts.getFlightToken().balanceOf(_walletUtils.getAddress())
      .then(res => {tokens = res})
  }

  // assign the values to display @return()
  const handlePayments = (res) => {

    // assign res values from blockchain, represent the payments
    const resAmount = res[0];
    const resSender = res[1];
    const resRecipient = res[2];
    const resTimestamp = res[3];
 
    // know how many times to iterate
    const len = resAmount.length;
 
    for(var ind = 0; ind<len; ind++) {
      var date = new Date(resTimestamp[ind]);
      var bufDate = date.getDate() + "." +
                    date.getMonth() + "." +
                    date.getUTCFullYear() + " " +
                    date.getHours() + ":" +
                    date.getMinutes();
      
      if(walletAddress == resSender[ind]) {
        var buf = {
          id: ind,
          amount: (0-resAmount[ind]),
          address: resRecipient[ind],
          timeDate: bufDate
        }
        dataToDisplayAsList.push(buf);
      }
      else if(walletAddress == resRecipient[ind]) {
        var buf = {
          id: ind,
          amount: (0+resAmount[ind]),
          address: resSender[ind],
          timeDate: bufDate
        }
        dataToDisplayAsList.push(buf);
      }
    }
    
    console.log("resAmount: ", resAmount);
    console.log("resSender: ", resSender);
    console.log("resRecipient: ", resRecipient);
    console.log("resTimestamp: ", resTimestamp);
  }

  return(
      <ScrollView>
          <View style={_styles.styles.containerFlightScreen}>
              <Text style={{ fontSize: 16, color: "blue"}}>Balance: {tokens} FLY</Text>
              <SafeAreaView style={{width: 400, height: 400}}>
                <FlatList
                  data={dataToDisplayAsList}
                  renderItem={itemView}
                  keyExtractor={dataToDisplayAsList => dataToDisplayAsList.id}
                />
              </SafeAreaView>
              { dataToDisplayAsList.length == 0?<Text>No balances available</Text> : null}
              <TouchableOpacity style={{width: 200, alignItems: "center", backgroundColor: "blue", height: 60, margin: 15}} 
                onPress={() => {
                    claimTokens();
                  }}>
                <Text style={{fontSize: 14}}>Buy Tokens</Text>
              </TouchableOpacity>

          <Dialog visible={claimDialog}>
            <DialogFooter>
              <DialogButton text="OK" onPress={() => {setClaimDialog(false)}} />
            </DialogFooter>
            <DialogContent>
              <Text>Inventory created!</Text>
            </DialogContent>
          </Dialog>

          </View> 
      </ScrollView>
  )
}


// update the status of a flight
const UpdateFlightScreen = ({ navigation }) => {

  // holds later all inventory flights
  var inventoryFlight = [];
  var mapArray = [];
  var searchDate = "";
  var datefields = "";
  var i;
  var flightStatus = [];
  const [ searchDialog, setSearchDialog ] = useState(false);
  var dialogText = "Searching for Flights...";

  const searchFlights = () => 
  {
    datefields = searchDate.split(".");
    funcContracts.getInvContract().searchFlights(parseInt(datefields[1]), parseInt(datefields[0]))
      .then(res => {
        console.log("Found flights: ", res);
        assignAllFlightsToArray(res);
      }).catch(err => console.log(err));
  }

  // as the name says - assign all flights from the inventory to inventoryFligh
  const assignAllFlightsToArray = (response) => {
    console.log("Response: ", response)

    var resultBuffer = response.split("_");

    dialogText = resultBuffer.length + " Flights found...";
    inventoryFlight = [];

    setTimeout( async () => {
      for (var ind = 0; ind < resultBuffer.length; ind++) {
        var ipfsInventory = await getJSON(resultBuffer[ind]);
        var buf = {
          flightNumber: ipfsInventory["flightNumber"],
          departure: ipfsInventory["departure"],
          arrival: ipfsInventory["arrival"],
          depTime: ipfsInventory["depTimePlanned"],
          arrTime: ipfsInventory["arrTimePlanned"],
          flightDuration: ipfsInventory["flightDuration"],
          aircraft: ipfsInventory["aircraft"],
          registration: ipfsInventory["registration"]
        };

        console.log("Buf pushed ", ind, ": ", buf);

        inventoryFlight.push(buf);
      }

      getStatusOfFlights();
    }, 500);
  }


  // 3rd get the status of the flight
  const getStatusOfFlights = () => {
    
    // first get the flightstatus for each flight
    flightStatus = [];
    dataListToShow = [];

    dialogText = "Getting Status...";
  
    i = 0;
    iterateThroughFlights();
  }


  const iterateThroughFlights = () => {
    if(i<inventoryFlight.length) {
      console.log("get status of flight: " + inventoryFlight[i].flightNumber)
      getFlightStatus(inventoryFlight[i].flightNumber, parseInt(datefields[1]), parseInt(datefields[0]));
    }
    else {
      createData();
    }
  }


  // get the flightstatus from pss contract 
  const getFlightStatus = (flightNumber, month, day) => {
    funcContracts.getPssInstance().getFlightStatus(flightNumber, month, day)
      .then(res => {console.log("state: ", res); flightStatus.push(res); ++i; iterateThroughFlights()});
  }


  const createData = () => {
        // then join all data in one data collection to show -- 
    // this is what decentralization is about!! there are many contracts, ipfs collection
    // and data splitted into many different contracts interacting together
    for(var i = 0; i<flightStatus.length; i++) {
      var buf = {
        flightNumber: inventoryFlight[i].flightNumber,
        departure: inventoryFlight[i].departure,
        arrival: inventoryFlight[i].arrival,
        month: parseInt(datefields[1]),
        day: parseInt(datefields[0]),
        depTime: inventoryFlight[i].depTime,
        arrTime: inventoryFlight[i].arrTime,
        aircraft: inventoryFlight[i].aircraft,
        registration: inventoryFlight[i].registration,
        status: flightStatus[i]
      }

      console.log("join flights ", i, ": ", buf);

      dataListToShow.push(buf);
    }

    console.log("mapArray = ", mapArray);

    setSearchDialog(false);

    navigation.navigate("Flights to Update");
  }


  return (
    <ScrollView>
      <View style={{flex: 1, flexDirection: "column", alignItems: "center", backgroundColor: "white", marginTop:100}}>
        <Text style={_styles.styles.searchLabelText}>Enter Search Date</Text>
        <TextInput style={_styles.styles.textInputBox} placeholder="dd.mm.yyyy"
                  onChangeText={ (value) => { searchDate = value }}/>
        <TouchableOpacity
            style={{width: 200, height:40, margin:10, backgroundColor: '#000F64'}}
            onPress={ () => { setSearchDialog(true); setTimeout(() => searchFlights(), 500); }}>
            <Text style={{color:"#fff", fontSize: 15, 
                          textAlign: "center", margin: 10}}>Search Flights</Text>
        </TouchableOpacity>
      </View>

      <Dialog visible={searchDialog}>
          <DialogContent>
            <Text>{dialogText}</Text>
          </DialogContent>
        </Dialog>

    </ScrollView>
  )
}


const showFlightsToUpdate = () => {

  var mapArray = [];

  for(var i=0; i<dataListToShow.length; i++) {
    mapArray.push(i);
  }


  return(
    <ScrollView>
      <View style={{flex: 1, flexDirection: "column", alignItems: "center", backgroundColor: "white", marginTop: 10}}>
        <View>
          <Text style={{color: "blue", fontWeight: "bold"}}>Flights Table</Text>
        </View>
      {mapArray.map(arr => (
        <TouchableOpacity key={arr} style={{ maxHeight:80, width: 350 , flex: 1, flexDirection: "row", 
                                 borderColor: "blue", borderWidth: 1, borderRadius: 2}}>
                                   
          <Text style={{ margin: 10, textAlign: "center"}}>{ dataListToShow[arr].flightNumber } </Text>
          <View style={{flex: 1, flexDirection: "column"}}>
            <Text style={{ marginTop: 10, marginBottom:5, textAlign: "center"}}>{ dataListToShow[arr].departure }  </Text>
            <Text style={{ marginTop: 5, marginBottom: 10, textAlign: "center"}}>{ dataListToShow[arr].depTime }  </Text>  
          </View>
          <Text style={{ margin: 20, textAlign: "center"}}> {"-->"}  </Text>
          <View style={{flex: 1, flexDirection: "column"}}>
            <Text style={{ marginTop: 10, marginBottom:5, textAlign: "center"}}>{ dataListToShow[arr].arrival }  </Text>
            <Text style={{ marginTop: 5, marginBottom: 10, textAlign: "center"}}>{ dataListToShow[arr].arrTime }  </Text>  
          </View>
          
        </TouchableOpacity>))}
      </View>
    </ScrollView>
  )
}


const CreateInventoryScreen = () => {

  const [ aircraft, setAircraft ] = useState("");
  const [ registration, setRegistration ] = useState("");
  const [ seats, setSeats ] = useState(0);
  const [ dialog, showDialog ] = useState(false);
  const [ invDialog, setInvDialog ] = useState(false);
  
  const createInventory = () => {

    const day = mBackend.getDate().day;

    const month = mBackend.getDate().month;

    console.log("ind for price search: ", ind);

    const price = mBackend.getSearchPrice(ind);

    const _cid = setJSON({ 
      "departure": pickedAirports.pickedDep, 
      "arrival": pickedAirports.pickedArr,
      "flightNumber": mBackend.getSearchFlightNumber(ind),
      "depTimePlanned": mBackend.getSearchDepTime(ind),
      "arrTimePlanned": mBackend.getSearchArrTime(ind),
      "flightDuration": mBackend.getSearchFlightTime(ind),
      "opDay": day,
      "opMonth": month,
      "seats": seats,
      "price": price,
      "taxes": 0.3, // this is for development - in production insert instead the real tax of the total price in percent
      "operator": "Luchshanse Airlines",
      "aircraft": aircraft,
      "registration": registration
    });

    funcContracts.getInvContract().createInventory(_cid, mBackend.getSearchFlightNumber(ind), month, day, seats)
                .then(res => {showDialog(false); setInvDialog(true); console.log("Succ RES: ", res)})
                .catch(err => console.log("ErrINV: ", err));
  }

  return(
    <ScrollView>
    <View style={_styles.styles.containerFlightScreen}>

      <Text style={_styles.styles.searchLabelText}>Create new Inventory for {mBackend.getSearchFlightNumber(ind)}</Text>
      <Text style={_styles.styles.searchLabelText}>Aircraft</Text>
      <TextInput style={_styles.styles.textInputBox} 
                  onChangeText={ (value) => { setAircraft(value) }}/>
      <Text style={_styles.styles.searchLabelText}>Registration</Text>
      <TextInput style={_styles.styles.textInputBox} 
                  onChangeText={ (value) => { setRegistration(value) }}/>
      <Text style={_styles.styles.searchLabelText}>Seats</Text>
      <TextInput style={_styles.styles.textInputBox} 
                  onChangeText={ (value) => { setSeats(value) }}/>

      <Dialog visible={dialog}>
        <DialogContent>
          <Text>Creating Inventory...</Text>
          <SearchingGif />
        </DialogContent>
      </Dialog>

      <Dialog visible={invDialog}
              footer={
                <DialogButton text="OK" onPress={() => {setInvDialog(false)}} />
              }>
        <DialogContent>
          <Text>Inventory created!</Text>
        </DialogContent>
      </Dialog>

      <TouchableOpacity
            style={{width: 200, height:40, margin:10, backgroundColor: '#000F64'}}
            onPress={ () => { showDialog(true); createInventory()}}>
            <Text style={{color:"#fff", fontSize: 15, 
                          textAlign: "center", margin: 10}}>Build Inventory</Text> 
        </TouchableOpacity>

    </View>
    </ScrollView>
  );
}

// main starting point
const App = () => {

  const Stack = createStackNavigator();

  return (  
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={StartScreen}/>
        <Stack.Screen name="Create new Flight" component={AddFlightScreen}/>
        <Stack.Screen name="Search for Flight" component={SearchFlightScreen}/>
        <Stack.Screen name="Flight Results" component={FlightResultsScreen}/>
        <Stack.Screen name="Create new Inventory" component={CreateInventoryScreen}/>
        <Stack.Screen name="Flight Control Center" component={UpdateFlightScreen}/>
        <Stack.Screen name="Flights to Update" component={showFlightsToUpdate}/>
        <Stack.Screen name="Token Portal" component={TokenPortalScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// export main point to start app
export default App;