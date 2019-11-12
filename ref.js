import React, { Component } from "react";
import { Text, StyleSheet, View, Button } from "react-native";

const Iota = require("@iota/core");
const Converter = require("@iota/converter");
import { generateSecureRandom } from "react-native-securerandom";

export default class App extends Component {
  constructor(props) {
    super(props);

    const iota = Iota.composeAPI({
      provider: "https://nodes.devnet.iota.org:443"
    });

    const address =
      "HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD";

    const seed =
      "PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX";

    const message = Converter.asciiToTrytes("Hello World!");

    const transfers = [
      {
        value: 0,
        address: address,
        message: message
      }
    ];

    const seedGenerator = () => {
      const length = 81;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";
      var randomValues = new Uint8Array(Array); //empty array to store random values
      var result = new Array(length); //empty array to store seed characters

      window.getRandomValues(randomValues); //random values generated and stored in the array

      var cursor = 0; //cursor introduced to removed modulus bias
      for (let i = 0; i < randomValues.length; i++) {
        //looped through the 81 character
        cursor += randomValues[i]; //add them to cursor
        result[i] = chars[cursor % chars.length]; //assign a new character to the seed based on cursor mod 81
      }

      return result.join(""); //merge array to a single string and return it
    };

    send = () => {
      console.log("Press");
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
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Button
          onPress={() => seedGenerator()}
          style={{ backgroundColor: "blue" }}
          title="Send!"
        ></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
