
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
// import Purchases from 'react-native-purchases';
import Game from '../Game/Game';
import { setLetters } from "../../utils";
import styles from './styles.js';
import { useNavigation } from '@react-navigation/native';

/*
 An example paywall that uses the current offering.
 */
const PaywallScreen = () => {
  // - State for all available package
 
  const [packages, setPackages] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const productIdentifier = 'sixs_3dollar_unlimited';
  const navigation = useNavigation();
  var purchaserInfo = [];
  
  useEffect(() => {

    const packageSetter = async () => {
      console.log('Useffect Paywall');

      try {
        const p = await Purchases.getProducts(['sixs_3dollar_unlimited']);
        console.log("in Paywall Screen, products array -->", p)
        setPackages(p);
       //  console.log("one has hope", p.map(x => x.priceString))
       } catch (e) {
         console.log ('darn, no packages', e.message);
       } 

    try {
      let customerInfo = await Purchases.getCustomerInfo();
      if(customerInfo.entitlements.active.Unlimited.productIdentifier !== "undefined") {
        // Grant user "pro" access
        console.log("*** We have entitlements (Paywall) ***");
        console.log(customerInfo);
        console.log(customerInfo.entitlements.active.Unlimited.productIdentifier);
        navigation.navigate('Game', {letters: setLetters(), gameState: 'practice' });
      }
  //     
    } catch (e) {
    }};
    packageSetter();
  }, []);

  // useEffect(async() => {
  //   try {
  //     purchaserInfo = await Purchases.getPurchaserInfo();
  //     console.log("bark --> ", purchaserInfo.entitlements);
  //     console.log("Purchase check--> ",purchaserInfo.entitlements.active.Unlimited.isActive)
  //     // access latest purchaserInfo
  //   } catch (e) {
  //    // Error fetching purchaser info
  //   }
  //   if (purchaserInfo.entitlements.active.Unlimited.isActive  === true) {
  //     navigation.navigate('Game', {letters: setLetters(), gameState: 'practice' });
  // }
  // }, [iWantToBuy]);

  const iWantToBuy = async () => {
    console.log("in Paywall")
    try {
      let purchaserInfo = await Purchases.getCustomerInfo();
      console.log("Paywall purchaserInfo ", purchaserInfo);
      console.log(Object.values(purchaserInfo))
    } catch (e) {
    }
    try {
      // console.log("clark", purchaserInfo);
      await Purchases.purchaseProduct("sixs_3dollar_unlimited", null, Purchases.PURCHASE_TYPE.INAPP);
      console.log("after purchase");
      console.log("Did I forget--> ",Purchases.getCustomerInfo())
      if (Purchases.getCustomerInfo() != undefined ) {
        console.log("iWantToBuy purchase check passed");
        
        navigation.navigate('Game', {letters: setLetters(), gameState: 'practice' });
    }
   } catch (e) {
      if (!e.userCancelled) {
        Alert.alert(e.message);
        navigation.navigate('Login');
      }
    }
    // navigation.navigate('Game', {letters: setLetters(), gameState: 'practice' });
  }

  const header = () => <Text style={styles.text}>Unlimited</Text>;

  const footer = () => {
    return (
      <Text style={styles.text}>
        Don't forget to add your subscription terms and conditions. Read more about this here:
        https://www.revenuecat.com/blog/schedule-2-section-3-8-b
      </Text>
    );
  };

  return (
    <View style={styles.page}>
      <Text>
        To purchase unlimited play of the Six(S) game press the following buton. You may need to restart the app after the purchase is complete.
      </Text>
      <TouchableOpacity
            onPress={iWantToBuy}
            style={[styles.button, styles.buttonOutline]}
            
          >
            {/* <Text>{packages.priceString}</Text> */}
        {packages.map((p) => (
        <Text> {p.priceString}</Text>
        ))}
      </TouchableOpacity>
    </View>
  )
  
};

export default PaywallScreen;

