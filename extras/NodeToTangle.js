//bundle sent to devnet node
//can be confirmed by search the hash of the bundle at devnet.tangle.org

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

    this.state = {
      seed: "",
      transfers: [
        {
          value: 0,
          address: "",
          message: ""
        }
      ]
    };

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

    addressGenerator = () => {
      var newAddress = Iota.generateAddress(this.state.seed, 2);

      let newArray = [...this.state.transfers];
      newArray[0].address = newAddress;
      this.setState({ transfers: newArray });

      console.log("Address: ", this.state.transfers[0].address);
      //return this.state.transfers[0].address;
    };

    messageToTrytes = () => {
      let trytes = Converter.asciiToTrytes(this.state.transfers[0].message);

      let newArray = [...this.state.transfers];
      newArray[0].message = trytes;
      this.setState(
        { transfers: newArray },
        console.log("Message: ", this.state.transfers[0].message)
      );
    };

    send = () => {
      iota
        .prepareTransfers(this.state.seed, this.state.transfers)
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
      let newArray = [...this.state.transfers];
      newArray[0].message = text;
      this.setState({ transfers: newArray });
    };

    textState = () => {
      console.log(this.state.transfers[0].message);
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
            value={this.state.transfers[0].message}
            onChangeText={text => handleTextChange(text)}
          />
          <View style={{ marginLeft: 10 }}>
            <Button
              onPress={() => messageToTrytes()}
              title="Convert to Trytes!"
            />
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <View>
            <Button
              onPress={() => seedGenerator()}
              title="Generate Seed!"
              color="green"
            />
          </View>

          {/* <View style={{ marginLeft: 10 }}>
            <Button
              onPress={() => addressGenerator()}
              title="Generate Address!"
            />
          </View> */}
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
