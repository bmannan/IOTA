//zero value transaction

import React, { Component } from "react";
import { Text, StyleSheet, View, Button, TextInput } from "react-native";

const Iota = require("@iota/core");
const Converter = require("@iota/converter");

export default class App extends Component {
  constructor(props) {
    super(props);

    const iota = Iota.composeAPI({
      provider: "https://nodes.devnet.iota.org:443"
    });

    //key : OHMAOCTQWMAYMDJVRPGGUZ9ZPVYKPWNAYXPWYYDZOPYXQWMJPHY9LNIKTDAFQUYDRMVMYJ9JHEJSJIEHO
    //address: JMZUHPOXXUHZNSFNEVCUSSBNTMAIGWEOCIIAPUTJVVVJACRQLKP9VY9YWNQOBRHEVDOCWQUFFAZZDMVYD - 1Ki
    this.state = {
      seed:
        "OHMAOCTQWMAYMDJVRPGGUZ9ZPVYKPWNAYXPWYYDZOPYXQWMJPHY9LNIKTDAFQUYDRMVMYJ9JHEJSJIEHO"
    };

    var transfers = [
      //contains information/data to be sent to recipient
      {
        address: "",
        value: 0,
        message: ""
      }
    ];

    seedGenerator = () => {
      const length = 81;
      var newSeed = "";
      const chars = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "9"
      ];

      for (let i = 0; i < length; i++) {
        newSeed += chars[Math.floor(Math.random() * 27)];
      }
      this.setState({ seed: newSeed }, () => {
        console.log("Seed: ", this.state.seed);
      });
    };

    addressGenerator = (index = 1, security = 1) => {
      iota
        .getNewAddress(this.state.seed, { index: index, security: security })
        .then(addr => {
          transfers[0].address = addr;
        });
    };

    send = () => {
      iota
        .prepareTransfers(this.state.seed, transfers)
        .then(trytes => {
          return iota.sendTrytes(
            trytes,
            3 /*depth*/,
            9 /*minimum weight magnitude*/
          );
        })
        .then(bundle => {
          console.log(`Bundle: ${JSON.stringify(bundle, null, 1)}`);
        })
        .catch(err => {
          // Catch any errors
          console.log(err);
        });
    };

    handleTextChange = text => {
      transfers[0].message = Converter.asciiToTrytes(text);
    };

    checkMessageState = () => {
      console.log(transfers[0]);
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            placeholder="Enter message to send here"
            placeholderTextColor="gray"
            onChangeText={text => handleTextChange(text)}
          />
          <View style={{ marginLeft: 10 }}>
            <Button
              onPress={() => checkMessageState()}
              title="Check Message!"
            />
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          {/* <View>
            <Button
              onPress={() => seedGenerator()}
              title="Generate Seed!"
              color="green"
            />
          </View> */}

          <View style={{ marginLeft: 10 }}>
            <Button
              onPress={() => addressGenerator()}
              title="Generate Address!"
            />
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <Button onPress={() => send()} title="Send Bundle!" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20
  },
  button: {
    paddingHorizontal: 10
  }
});
