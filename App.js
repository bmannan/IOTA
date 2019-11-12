//non zero value transaction

import React, { Component } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Button,
  TextInput
} from "react-native";

const Iota = require("@iota/core");
const Converter = require("@iota/converter");

export default class App extends Component {
  constructor(props) {
    super(props);

    const iota = Iota.composeAPI({
      provider: "https://nodes.devnet.iota.org:443"
    });

    // ---INFO---
    //seed : OHMAOCTQWMAYMDJVRPGGUZ9ZPVYKPWNAYXPWYYDZOPYXQWMJPHY9LNIKTDAFQUYDRMVMYJ9JHEJSJIEHO
    //address: NDOC9IFG9ZRJPOPRUUZOKSHRXOMUPWYBFNJDPJNXXNGYNILSPAZNNTSOBYLXXYNVJLGIJFABAYJI9HPZA - 1Ki index=0, sec=1
    //address: FWTNPHUZOVIHLTJGURTVLFBQQHACHHCPYSLKJBDLMAOLMJTIHEAUDHAKLJCEOWMBHKZEIODH9U9GFBPMC - 1Ki index=2, sec=3

    //seed: GFYSPPHQHX9REC9F9GBKWW9KMNU9MLBRLYKCXTOJMHYIUYVZQIFIBWAQBHSCWDECWFUOAAPYYDTEYDCHB
    //address:  OPCZMNHDSOMMZFFLRGIBZDLOCMHMCNHQGXWVTWEFOKMTLRHWXNJPMJRRVSBQBXYE9HHDTYZWNCDCWPIVW - 1Ki

    //receipient seed: OG9YBWRFZTEZZCZFKOLJHLLYUEVQGIBBNPDXZFEWXOARO9P9HWNEBBATA9IRYDSLHYZEEJBJXBMTILDCO
    //receipient addr: SAIMLNHXIJMZSQUWHFLFSUTCWMMPKHEEUUKBGP9FF9NQJVGBPUXCXGGOITUTZTDDRKSNYH9HULPKMHL9C

    //new seed: D9WZMPGWBSRXWOLSLQUJYYCYSAEYOWLKWMRYX9DWBOCTPYEWMSWIFIXCTHEAWHKOHHALSQOYOMODMTDFY
    //new address: NWNJSOUQXSSPCTNCFDISJUANDVDPGWWQRZFLZXQVGBCRXYKNQZRRASNXNGLXSDFORKLDHQXNY9ZY9NFWD

    //S seeds
    //seed 1: IMYMYRHMIDDJSQNQHPAYYLHSTR9SOHGMNOQLUPMENK9WVMVKNSEVFXDGXHHKJUYUBYVAFKFKYTXXMCHZX
    //add 1:  CRMCJNAZTOUEKRFPWSXRLPKBLDCIHHBUMPPSCHP9ANDJMJEIFXMEPKCB9FQXFLWEWYEM9SV9HXOKREEHB - 1ki

    //seed 2: TONVJBOARQUVOJTFG9TZBUULLHEVPPTMOHJNAXHXQZDSQNNCYGSYVBMQFFUOYPUUYJYSBOQKXWEKPJMYP
    //add 2:  MRX9SLMGVPGQKKONVSZRJQONBSCT9DNMAAYYRGQOQPEATKCBEGY9FUZCWBGLLNABKANZABOMCKPHPQKGC - used receive
    //add 2b: JJTUSDODHWPVXOMYBTOFUUMCUVWFAWUAXZVTFCDPAWXLDEHOESHYOWMKXRHQBDYVGQKEIDUSAUJREHMOD - used receive

    //seed 3: UBJONLFBBOPXIYSOSJTFSSIVPRKNXWFFZ9ALEMFARBBQBR9BFBCTYAMRIXDVPDGOMKJVAMOFYZCXWWWDV
    this.state = {
      seed:
        "TONVJBOARQUVOJTFG9TZBUULLHEVPPTMOHJNAXHXQZDSQNNCYGSYVBMQFFUOYPUUYJYSBOQKXWEKPJMYP"
    };

    transfers = [
      //contains information/data to be sent to recipient
      {
        value: 0,
        address:
          "SAIMLNHXIJMZSQUWHFLFSUTCWMMPKHEEUUKBGP9FF9NQJVGBPUXCXGGOITUTZTDDRKSNYH9HULPKMHL9C",
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

    addressGenerator = () => {
      iota.getNewAddress(this.state.seed, { total: 1 }).then(addr => {
        transfers[0].address = addr[0];
      });
    };

    handleTextChange = text => {
      transfers[0].message = Converter.asciiToTrytes(text);
    };

    handleValueChange = value => {
      transfers[0].value = parseInt(value, 10);
      //console.log(transfers[0].value);
    };

    checkMessageState = () => {
      console.log(transfers[0]);
    };

    send = () => {
      iota
        .prepareTransfers(this.state.seed, transfers)
        .then(trytes => {
          return iota.sendTrytes(trytes, 3, 9);
        })
        .then(bundle => {
          console.log(bundle);
        })
        .catch(err => {
          console.error(err);
        });
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
              title="Check Transfer State!"
            />
          </View>
        </View>

        <View style={styles.valueContainer}>
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            placeholder="Enter value to be sent"
            placeholderTextColor="gray"
            keyboardType="number-pad"
            onChangeText={value => handleValueChange(value)}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <View>
            <Button
              onPress={() => seedGenerator()}
              title="Generate Seed!"
              color="green"
            />
          </View>

          <View style={{ marginLeft: 10 }}>
            <Button
              onPress={() => addressGenerator()}
              title="Generate Address!"
            />
          </View>

          <View style={{ marginLeft: 10 }}>
            <Button onPress={() => send()} title="Send Bundle!" />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
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
