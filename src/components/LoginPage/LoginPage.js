import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants';
import Game from '../Game/Game';
import LetterList from '../../utils/LetterList';
import { getDayOfYear, setLetters } from '../../utils';
import * as RNIap from 'react-native-iap';
import { getProducts } from 'react-native-iap';
import InstructionPage from '../InstructionPage';
import { useDispatch, useSelector } from 'react-redux';
import { updateHasPurchased } from '../../utils';


// const dayOfTheYear = getDayOfYear();
// const dailyLetters = LetterList[dayOfTheYear];
const skus = Platform.select({
  ios: ['sixs_3dollar_unlimited'],
  android: ['sixs_3dollar_unlimited'],
 });

const LoginPage = ({ connected, noTimer }) => {
  const dispatch = useDispatch();
  const hasPurchased_sixs_3dollar_unlimited = useSelector(state => state.hasPurchased_sixs_3dollar_unlimited);
  const [purchaserInfo, setPurchaserInfo] = useState(null);
  const dayOfTheYear = getDayOfYear();
  console.log('dayOfTheYear', dayOfTheYear)
  const dailyLetters = LetterList[dayOfTheYear];
  console.log(dailyLetters)
  const navigation = useNavigation();
  console.log('Login page, daily letters --->', dailyLetters)

useEffect(() => {
  if (!hasPurchased_sixs_3dollar_unlimited){
    async function getPurchaseStatus() {
      try {
        const result = await RNIap.initConnection();
        console.log(dailyLetters)
        console.log('In-app purchases connected:', result);
      } catch (e) {
        console.log('Error connecting to in-app purchase service:', e);
      }

      try {
        const products = await getProducts({skus});
        console.log('Products:', products);
        console.log('length', products.length)
        if (products && products.length > 0) {
          const purchaseUpdatedListener = RNIap.purchaseUpdatedListener(async (purchase) => {
            console.log('in useEffect, login');
            // console.log('receipt', purchase.transactionReceipt)
            if (Platform.OS === 'ios') {
              dispatch(updateHasPurchased(true));
            } else if (Platform.OS === 'android') {
              dispatch(updateHasPurchased(true));
            }
            // console.log('Purchase updated:', purchase);
          });

          return () => {
            purchaseUpdatedListener.remove();
          };
        }
      } catch (e) {
        console.log('Error getting products:', e);
      }
    }

    getPurchaseStatus();
  }
  }, []);


  // test code to make acknowledgePurchase work
  // tested here, because Google only phantom refunded purchases.

  // useEffect(() => {
  //   async function checkForPurchases() {
  //     console.log('checking for purchases');
  //     try {
  //       await RNIap.initConnection();
  //       const purchases = await RNIap.getAvailablePurchases();
  //       console.log('Check for Purchases ***** Purchases:', purchases);
  //       const hasPurchased = purchases.some(purchase => purchase.productId === 'sixs_3dollar_unlimited');
  //       if (hasPurchased) {
  //         console.log('Purchased!');
  //         const unacknowledgedPurchases = purchases.filter(purchase => !purchase.acknowledged);
  //         console.log('Unacknowledged Purchases:', unacknowledgedPurchases);
  //         for (const purchase of unacknowledgedPurchases) {
  //           console.log('Purchase token', purchase.purchaseToken)
  //           await RNIap.acknowledgePurchaseAndroid({token: `${purchase.purchaseToken}`});
  //           console.log(`Purchase ${purchase.purchaseToken} acknowledged.`);
  //         }
  //       } else {
  //         console.log('Not purchased!');
  //       }
  //     } catch (error) {
  //       console.log('Error:', error);
  //     }
  //   }

  //   checkForPurchases();
  // }, []);

  const goToGame = () => {
    navigation.navigate('Game', { letters: dailyLetters, gameState: 'playing', noTimer: noTimer });
  };

  const instructMe = () => {
    navigation.navigate('Instruction');
  };

  const amIUpgraded = async () => {
    navigation.navigate('Paywall');
    if (hasPurchased_sixs_3dollar_unlimited){
      navigation.navigate('Game', { letters: setLetters(), 
        gameState: 'practice', 
        noTimer: noTimer });
    }
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.log('Purchases:', purchases);
      console.log('Login')
      const hasPurchased = purchases.some(purchase => purchase.productId === 'sixs_3dollar_unlimited');
      if (hasPurchased) {
        console.log('En route')
        dispatch(updateHasPurchased(true));
        navigation.navigate('Game', { letters: setLetters(), 
          gameState: 'practice', 
          noTimer: noTimer });
      } else {
        console.log('Foiled');
        console.log('has purchased', hasPurchased)
        navigation.navigate('Paywall');
      }
    } catch (e) {
      console.log('getAvailablePurchases error:', e);
    }
  };

  const MultiStart = async () => {
    if (hasPurchased_sixs_3dollar_unlimited){
      navigation.navigate('Multi', { letters: '', 
      gameState: 'multi', 
      noTimer: noTimer })
    }
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.log('Purchases:', purchases);
      const hasPurchased = purchases.some(purchase => purchase.productId === 'sixs_3dollar_unlimited');
      if (hasPurchased) {
        navigation.navigate('Multi', { letters: '', 
          gameState: 'multi', 
          noTimer: noTimer });
      } else {
        navigation.navigate('Paywall');
      }
    } catch (e) {
      console.log('getAvailablePurchases error:', e);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.instructionText}>Six(S) is a word creation game. There is a row of 10 letters at the top 
      with the associated scores below them. Vowels are worth one. Consonants increase in value as the list 
      moves right. Magenta squares are worth double. You can make 4 or 5 letter words, but 6 letter words are 
      worth double. {"\n"}
      There are two scoring modes you can change them on the Instructions Page. </Text>
      <Text style={styles.colorblock}>ABCDEFGHIJKLMNOP</Text>
      <Text style={styles.colorblockChallenge}>ABCDEFGHIJKLMNOPQRSTUVWXYZab</Text>
        <Text style={styles.title}>           Six(S)           </Text>
        <TouchableOpacity style={styles.button} onPress={goToGame}>
          <Text style={styles.buttonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={amIUpgraded}>
          <Text style={styles.buttonText}>Unlimited</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={MultiStart}>
          <Text style={styles.buttonText}>MultiPlayer</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.button} onPress={instructMe}>
          <Text style={styles.buttonText}>Instructions / Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorblock: {
    fontFamily: "frisbeespidercolorbox",
    fontSize: 36,
  },
  colorblockChallenge: {
    fontFamily: "Challenge",
    fontSize: 36,
  },
  scroll: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  instructionText: {
    color: 'white',
    fontSize: 21,
    margin: 15,
  },
  title: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    },
    });
    
    export default LoginPage;

  
  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     backgroundColor: colors.darkgrey,
  //     padding: 20,
  //     paddingTop: 40
  //   },
  //   inputContainer: {
  //     width: '80%'
  //   },
  //   input: {
  //     backgroundColor: 'white',
  //     paddingHorizontal: 15,
  //     paddingVertical: 10,
  //     borderRadius: 10,
  //     marginTop: 5,
  //   },
  //   buttonContainer: {
  //     width: '60%',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     marginTop: 40,
  //   },
  //   button: {
  //     backgroundColor: '#661538',
  //     width: '100%',
  //     padding: 15,
  //     borderRadius: 10,
  //     alignItems: 'center',
  //   },
  //   buttonOutline: {
  //     backgroundColor: 'white',
  //     marginTop: 5,
  //     borderColor: '#661538',
  //     borderWidth: 2,
  //   },
  //   buttonText: {
  //     color: 'white',
  //     fontWeight: '700',
  //     fontSize: 16,
  //   },
  //   buttonOutlineText: {
  //     color: '#661538',
  //     fontWeight: '700',
  //     fontSize: 16,
  //   },
  //   instructions: {
  //     alignItems: 'center',  
  //     justifyContent: 'center',
      
  //     color: colors.lightgrey,
      
  //     fontSize: 20,
      
  // },
  // })