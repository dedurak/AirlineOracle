import { StyleSheet } from 'react-native';

export class MyStyles {

    styles = StyleSheet.create({
        buttonSelected: {
          backgroundColor: 'blue'
        },
        buttonNotSelected: {
          backgroundColor: 'white'
        },
        container: {
          flex: 1,
          alignItems: "center",
          backgroundColor: '#fff',
          paddingTop: 20
        },
        checkBoxContainer: {
          borderWidth: 1,
          borderColor: 'blue'
        },
        checkBox: {
          flexDirection: "column",
          margin: 5,
          padding: 5
        },
        containerFlightScreen: {
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#fff',
          margin: 20
        },
        headerText: {
          color: '#00008B',
          fontSize: 50
        },
        searchLabelText: {
          color: '#00008B',
          fontSize: 14,
          paddingTop: 10,
          paddingBottom: 5
        },
      
        textInputBox: {
          borderColor: 'blue',
          borderWidth: 2,
          width: 300,
          height: 40,
          padding: 10
        }
      })
}