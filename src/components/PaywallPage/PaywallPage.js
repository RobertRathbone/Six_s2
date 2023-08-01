import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, Button, Platform, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { setLetters, updateHasPurchased } from "../../utils";
import * as RNIap from 'react-native-iap';
import { useDispatch, useSelector } from 'react-redux';


const itemSkus = 
['sixs_3dollar_unlimited'] // ios works for iap


const PaywallPage = () => {
const [productDetails, setProductDetails] = useState([]);
const [loaded, setLoaded] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const dispatch = useDispatch();
const hasPurchased_sixs_3dollar_unlimited = useSelector(state => state.hasPurchased_sixs_3dollar_unlimited);
const navigation = useNavigation();

useEffect(() => {
  console.log('mounted');
  console.log(hasPurchased_sixs_3dollar_unlimited);
  connectToInAppPurchases();
}, []);

const connectToInAppPurchases = async () => {
try {
await RNIap.initConnection();
  console.log('Successfully connected to in-app purchase service.');
  getProductDetails({ skus: [itemSkus] });
  console.log('if', loaded)
} catch (err) {
  console.log('Error connecting to in-app purchase service:', err);
  setError(err.message);
}
};

const getProductDetails = async () => {
try {
if (!loaded) {
  const result = await RNIap.getProducts({ skus: itemSkus });
  setProductDetails(result);
  setLoaded(true);
}
} catch (err) {
  console.log('fetchProducts error:', err);
  setError(err.message);
}
};

const onPurchasesUpdated = async (purchases) => {
  try {
    console.log('in onPurchasesUpdated', purchases);
    if (!Array.isArray(purchases)) {
      purchases = [purchases]; // convert to array if not already one
    }
    for (const purchase of purchases) {
      if (!purchase.isAcknowledged) {
        console.log('in onPrchasesUpdate');
        console.log('------->  ',purchase.purchaseToken);
        const ackResult = await RNIap.acknowledgePurchaseAndroid({token: `${purchase.purchaseToken}`});
        console.log('Purchase acknowledged:', ackResult);
      }
    }
  } catch (err) {
    console.log('Error acknowledging purchases:', err);
  }
};

const acknowledgePurchase = async () => {
  try {
    RNIap.purchaseUpdatedListener(onPurchasesUpdated);
  } catch (err) {
    console.log('Error initializing connection:', err);
  }
};



const purchaseItem = async (productId) => {
try {
  setLoading(true);
  console.log('Attempting to purchase',productId);
  
  const purchase = await RNIap.requestPurchase({skus: [productId]});  // android
  // const purchase = await RNIap.requestPurchase({sku: productId});  //ios                                    
  console.log("after purchase attempt")
  console.log('Purchase complete!', purchase);
  console.log(purchase[0].purchaseToken)
  await acknowledgePurchase(purchase[0]); // android
  dispatch(updateHasPurchased(true));
  setLoading(false);
  navigation.navigate('Game', {letters: setLetters(), gameState: 'practice' });
} catch (err) {
  console.log('in purchase', err);
  setError(err.message);
  setLoading(false);
  Alert.alert('Error', err.message);
}
};



return (
<View style={styles.container}>
{productDetails ? (
productDetails.length === 0 ? (
<Text>Loading...</Text>
) : (
<>
{productDetails.map((product) => (
<Button
key={product.productId}
title={`Unlimited game play ${product.title} - ${product.price}`}
onPress={() => {
setLoading(true);
purchaseItem(product.productId);
}}
style={styles.button}
/>
))}
{loading && <ActivityIndicator size="small" color="white" />}
{hasPurchased_sixs_3dollar_unlimited && <Text style={styles.purchaseText}>Purchase complete!</Text>}
</>
)
) : (
<Text>Loading...</Text>
)}
{error && <Text>{error}</Text>}
</View>
);

};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: 'white',
justifyContent: 'center',
alignItems: 'center',
},
button: {
height: 30,
marginVertical: 10,
backgroundColor: 'grey',
paddingHorizontal: 15,
borderRadius: 5,
},
purchaseText: {
color: 'black',
marginVertical: 10,
},
});

export default PaywallPage;





