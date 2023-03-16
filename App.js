import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, FlatList, } from 'react-native';
import { colors } from './src/constants';
import Game from './src/components/Game/Game';
import SharePage from './src/components/SharePage';
import LoginPage from './src/components/LoginPage';
import FinalPage from './src/components/FinalPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLetters, getDayOfYear, getDayOfYearKey } from './src/utils';
import LetterList from './src/utils/LetterList';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Animated, {
  SlideInLeft, 
} from 'react-native-reanimated';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import useFonts from './hooks/useFonts';
// import Purchases from 'react-native-purchases';
// import  PackageItem  from './';
import PaywallPage from './src/components/PaywallPage';
import {initConnection} from 'react-native-iap';



const NUMBER_OF_TRIES  = 6;
var sendLetters = setLetters();
var score = 0;
let purchaserInfo = []; 
var shareArray =  
// ['K', 'L', 'M', 'N', 'N', 'P',
// 'K', 'L', 'M', 'N', 'N', 'P',
// 'K', 'L', 'M', 'N', 'N', 'P',
// 'K', 'L', 'M', 'N', 'N', 'P',
// 'K', 'L', 'M', 'N', 'N', 'P',
// 'K', 'L', 'M', 'N', 'N', 'P',
// ];
[ ['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',]
];
const Stack = createNativeStackNavigator();
const dailyLetters = LetterList[dayOfTheYear];
const dayOfTheYear = getDayOfYear();
const dayOfTheYearKey = getDayOfYearKey();
const dayKey = `day-${dayOfTheYearKey}`
const letters = sendLetters.toString().toUpperCase().replace(/,/g, "");

const App = (() => {
  const [connected, setConnected] = useState(false);
  const [purchaserInfo, setPurchaserInfo] = useState([]);
  const [upgradeCheck, setUpgradeCheck] = useState(false);

  global.prods =[];
  useEffect(() => {
    connectToInAppPurchases();
  }, []);

  const connectToInAppPurchases = async () => {
    try {
      await initConnection();
      console.log('Connected to in-app purchases');
      setConnected(true);
    } catch (error) {
      console.log(`Error connecting to in-app purchases: ${error}`);
    }
  };

  // useEffect(() => {
    //Revenue cat api removed 1/3/23
  //   let apiK = "";
  //   console.log("In useEffect")
  //   const main = async () => {

  //     Purchases.setDebugLogsEnabled(true);

  //     await Purchases.configure({apiKey: 'appl_pypHRvkonNwzsuaWDQSwvacGnbv '});
  //     await Purchases.configure({apiKey: 'goog_qXkCBjzUWvWJHsxFDivMbvXVDHT'});

  //   };
  //   main();
  // }, []);

  const [IsReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   const main = async () => {
  //   Purchases.setDebugLogsEnabled(true);
  //   if (Platform.OS === 'ios') {
  //     console.log('yo')
  //     await Purchases.configure({apiKey: 'appl_pypHRvkonNwzsuaWDQSwvacGnbv '});
  //     console.log('ios');
  //   } else if (Platform.OS === 'android') {
  //     console.log('abdroid')
  //     await Purchases.configure({apiKey: 'goog_qXkCBjzUWvWJHsxFDivMbvXVDHT'});
  //   };
  //   };
  //   main();
  // }, [])
  
  const LoadFonts = async () => {
    await useFonts();
  }; 
  if (!IsReady) {
    return (
      <AppLoading
        startAsync={LoadFonts}
        onFinish={() => setIsReady(true)}
        onError={() => {}}
      />
    );
  }
  

  return (

    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator>
              <Stack.Screen
                options={{ headerShown: false }}
                name="Login"
              >
                {(props) => <LoginPage {...props} connected={connected} />}
              </Stack.Screen>
                <Stack.Screen
                name="Paywall"
                >
                {(props) => <PaywallPage {...props} connected={connected} />}
                </Stack.Screen>
                <Stack.Screen
                name="Game"
                component={Game}
                options={{ letters: {sendLetters}}}
                />
                <Stack.Screen
                name="Share"
                component={SharePage}
                options={{ shareArray: {shareArray}, score: {score} }}
                />
                <Stack.Screen
                name="Final"
                component={FinalPage}
                />
              
            </Stack.Navigator>
    </NavigationContainer>  
    
  );
})

export default App;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: 'bold',
    letterSpacing: 15,
    marginVertical: 20,
    
  },
  subtitle: {
    color: colors.lightgrey,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 22,
    lineHeight: 23,
  },
  
});
