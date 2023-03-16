// import React, { useState, useEffect } from 'react';
// import { ActivityIndicator, View, Text, Button, StyleSheet } from 'react-native';
// import { connectAsync, getProductsAsync, purchaseItemAsync } from 'expo-in-app-purchases';
// import { useNavigation } from '@react-navigation/core'
// import { setLetters } from "../../utils";

// const itemSkus = Platform.select({
//   ios: ['sixs_3dollar_unlimited'],
//   android: ['sixs_3dollar_unlimited'],
// });

// const PaywallPage = ({ connected }) => {
//   const [purchased, setPurchased] = useState(false);
//   const [productDetails, setProductDetails] = useState([]);
//   const [loaded, setLoaded] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const navigation = useNavigation()
//   useEffect(() => {
//     console.log('mounted');
//     if (!connected) {
//       connectAsync().then(() => {
//         console.log('Successfully connected to in-app purchase service.');
//         getProductDetails();
//         console.log('if')
//       })
//       .catch((err) => {
//         console.log('Error connecting to in-app purchase service:', err);
//         setError(err.message);
//       });
//     } else {
//       getProductDetails();
//       console.log('else');
//     }
//   }, []);
  

//   const getProductDetails = async () => {
//     try {
//       if (!loaded) {
//         const result = await getProductsAsync(itemSkus);
//         console.log('details', result);
//         setProductDetails(result.results);
//         setLoaded(true);
//       }
//     } catch (err) {
//       console.log('fetchProducts error:', err);
//       setError(err.message);
//     }
//   };

//   const purchaseItem = async (sku) => {
//     try {
//       const purchase = await purchaseItemAsync(sku);
//       setPurchased(true);
//       console.log('Purchase complete!');
//       setLoading(false);
//       navigation.navigate('Game', {letters: setLetters(), gameState: 'practice' });
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//       console.log('in purchase', err);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {productDetails ? (
//         productDetails.length === 0 ? (
//           <Text>Loading...</Text>
//         ) : (
//           <>
//             {productDetails.map((product) => (
//               <Button
//                 key={product.productId}
//                 title={`Unlimited game play ${product.title} - ${product.price}`}
//                 onPress={() => {
//                   setLoading(true);
//                   purchaseItem(product.productId);
//                 }}
//                 color="white"
//                 style={styles.button}
//               />
//             ))}
//             {loading && <ActivityIndicator size="small" color="white" />}
//             {purchased && <Text style={styles.purchaseText}>Purchase complete!</Text>}
//           </>
//         )
//       ) : (
//         <Text>Loading...</Text>
//       )}
//       {error && <Text>{error}</Text>}
//     </View>
//   );

// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   button: {
//     height: 30,
//     marginVertical: 10,
//     backgroundColor: 'white',
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   purchaseText: {
//     color: 'black',
//     marginVertical: 10,
//   },
// });

// export default PaywallPage;

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { setLetters } from "../../utils";
import * as RNIap from 'react-native-iap';

const itemSkus = 
['sixs_3dollar_unlimited'] // ios works for iap
// const itemSkus = 'sixs_3dollar_unlimited' android testing for iap



const PaywallPage = () => {
const [purchased, setPurchased] = useState(false);
const [productDetails, setProductDetails] = useState([]);
const [loaded, setLoaded] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const navigation = useNavigation();

useEffect(() => {
  console.log('mounted');
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

const purchaseItem = async (productId) => {
try {
  setLoading(true);
  console.log('Attempting to purchase',productId);
  const purchase = await RNIap.requestPurchase({sku: productId});
  console.log("after purchase attempt")
  console.log('Purchase complete!', purchase);
  setPurchased(true);
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
{purchased && <Text style={styles.purchaseText}>Purchase complete!</Text>}
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





