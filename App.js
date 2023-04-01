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
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font';
import PaywallPage from './src/components/PaywallPage';
import InstructionPage from './src/components/InstructionPage';
import {initConnection} from 'react-native-iap';
import { isLoaded } from 'expo-font';



const NUMBER_OF_TRIES  = 6;
var sendLetters = setLetters();
var score = 0;
let purchaserInfo = []; 
var shareArray =  
[ ['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',]
];
const dayOfTheYear = getDayOfYear();
const dailyLetters = LetterList[dayOfTheYear];
// const dayOfTheYearKey = getDayOfYearKey();
// console.log('dayOfTheYearKey', dayOfTheYearKey)
// const dayKey = `day-${dayOfTheYearKey}`
// console.log('dayKey', dayKey)
const letters = sendLetters.toString().toUpperCase().replace(/,/g, "");

const Stack = createNativeStackNavigator();
const App = (() => {
  const [connected, setConnected] = useState(false);
  const [purchaserInfo, setPurchaserInfo] = useState([]);
  const [upgradeCheck, setUpgradeCheck] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const [noTimer, setNoTimer] = useState(false);

  const onToggleChallenge = () => {
      setChallenge(!challenge);
  }
  const onToggleTimer = () => {
    setNoTimer(!noTimer);
}

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

  const [isReady, setIsReady] = useState(false);

  const loadFonts = async () =>{
    await Font.loadAsync({
      'frisbeespidercolorbox': require('./assets/fonts/frisbeespidercolorbox.ttf'),
      // android: {
      //   'frisbeespidercolorbox': require('./assets/fonts/frisbeespidercolorbox.ttf')
      // }
    });
    setIsReady(true);
}
useEffect(() => {
  // console.log('before load fonts')
  // console.log('App.js page, daily letters --->', dailyLetters)
  loadFonts();
  if (Font.isLoaded('frisbeespidercolorbox')) {
    console.log('The font is loaded!');
  } else {
    console.log('The font is not yet loaded...');
  }
  SplashScreen.hideAsync();
}, []);

if (!isReady) {
  return null;
}

  return (

    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator>
              <Stack.Screen
                options={{ headerShown: false }}
                name="Login"
              >
                {(props) => <LoginPage {...props} connected={connected} challenge={challenge} noTimer={noTimer}/>}
              </Stack.Screen>
                <Stack.Screen
                name="Paywall"
                >
                {(props) => <PaywallPage {...props} connected={connected} />}
                </Stack.Screen>
                <Stack.Screen
                name="Game"
                component={Game}
                options={{ letters: {sendLetters}, challenge:{challenge}, noTimer:{noTimer}}}
                />
                <Stack.Screen
                name="Share"
                component={SharePage}
                options={{ shareArray: {shareArray}, score: {score} }}
                />
                <Stack.Screen
                name="Instruction"
                >
                {(props) => <InstructionPage {...props} challenge={challenge} 
                onToggleChallenge={onToggleChallenge}
                noTimer={noTimer}
                onToggleTimer={onToggleTimer}

                />}
                </Stack.Screen>
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
