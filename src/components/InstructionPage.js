import React, {useEffect, useState} from 'react';
import { Alert, StyleSheet, Text, Platform, TouchableOpacity, View, SafeAreaView, ScrollView } from 'react-native';
import * as RNIap from 'react-native-iap';
import { useDispatch, useSelector } from 'react-redux';
import { updateHasPurchased, setChallenge, setTimer } from '../utils';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InstructionPage = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const challenge = useSelector(state => state.challenge);
  const noTimer = useSelector(state => state.noTimer);
  const [highScore, setHighScore] = useState(0);
  const handleToggleChallenge = () => {
    dispatch(setChallenge(!challenge));
  };

  const handleToggleTimer = () => {
    dispatch(setTimer(!noTimer));
  };

  useEffect(() => {
    async function loadData() {
        try {
        const storedHighScore = await AsyncStorage.getItem('highScore');

        if (storedHighScore !== null) {
            setHighScore(parseInt(storedHighScore));
        }
        } catch (error) {
        console.log(error);
        } finally {
            setIsLoading(false);
          }
    }
    loadData();
    }, []);


    const productIds = ['sixs_3dollar_unlimited'];

    const restorePurchases = () => {
        RNIap.initConnection()
        .then(() => {
          if (Platform.OS === 'ios') {
            RNIap.getAvailablePurchases()
              .then((purchases) => {
                // handle restored purchases
                dispatch(updateHasPurchased(true));
                console.log('Restored purchases:', purchases);
              })
              .catch((error) => {
                console.log('Failed to get restored purchases:', error);
              });
          } else if (Platform.OS === 'android') {
            RNIap.getAvailablePurchases()
              .then((purchases) => {
                // handle restored purchases
                dispatch(updateHasPurchased(true));
                console.log('Restored purchases:', purchases);
              })
              .catch((error) => {
                console.log('Failed to get restored purchases:', error);
              });
          }
        })
        .catch((error) => {
          console.log('Failed to initialize connection:', error);
        });
      return () => {
        RNIap.endConnection();
      };
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.instructionText}>Welcome to 6(S)!

                    The goal of the game is to create 6 6-letter words from the 10 letters shown at the top. 
                    The value of each letter is directly beneath it. Type in the letters for each word, then hit the 
                    SCORE button to “register” and score it. You can navigate around the board to put the highest-value 
                    letters on the magenta boxes to double their score. If you can't think of a 6-letter word, you can 
                    make shorter words. But, 6 letters score double. After you are 
                    done making the best words you can (feel free to move around the board and make any changes you want), 
                    hit the “I am Done” button to get your final score.
                    {"\n"}{"\n"}

                    Example: If you have the word “YEAST” in row 2, the S would be worth 6 points. If you have the word 
                    “YEASTY” in row 2, the S would be worth 12 points (doubled because it is a 6-letter word). However, if 
                    you have the word “YEASTY” in row 6, the S would be worth a whopping 24 points (doubled again because 
                    the S is on a magenta box). 
                    {"\n"}{"\n"}
                    "ASSESS" is a very good word in regular mode.
                    {"\n"}{"\n"}

                    Challenge mode: The first S in any row is worth 6, and any subsequent S's in the same row are only worth 1. 
                    However (and this is the special part), you can double your whole score if you have exactly one S per row! 
                    Change to Challenge mode on the Instructions page below. 
                    {"\n"}{"\n"}
                    "ASSESS" is not a good word in challenge mode.
                </Text>
                    <View style={styles.buttonMiddle}>
                    <TouchableOpacity style={styles.button} onPress={handleToggleChallenge}>
                        <Text style={styles.buttonText}>  { challenge ? 'Regular' : 'Engage Challenge'}  </Text>
                     </TouchableOpacity>
                     </View>
                <Text style={styles.instructionText}>
                    A note about the timer: Presently, the time limit does not interfere with your game play. You can continue 
                    playing after time runs out with no penalty. You can even remove the timer below if you want a more 
                    “Zen” playing experience.
                </Text>
                    <View style={styles.buttonMiddle}>
                    <TouchableOpacity style={styles.button} onPress={handleToggleTimer}>
                        <Text style={styles.buttonText}>  { noTimer ? 'Timer' : 'Remove Timer'}  </Text>
                    </TouchableOpacity>
                    </View>
                <Text style={styles.instructionText}>
                    Ready to play? After you have made all your words, hit the “I am Done” button to get your final score, 
                    see the highest scoring words, and share your board! The board of colored boxes is a visual representation 
                    of your score. The darker colors represent a higher score. Buy the unlimited version, and get upgraded from 
                    magenta to purple boxes.
                    {"\n"}{"\n"}

                    Have fun and thanks for playing!
                </Text>
                <View style={styles.buttonMiddle}>
                {highScore != 0 &&
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Stats')}>
                    <Text style={styles.buttonText}>Stats</Text>
                  </TouchableOpacity>
                }
                 </View>
                <View style={styles.buttonMiddle}>
                 <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Restore Purchases', 'Are you sure?', 
                 [{ text: 'Cancel' }, { text: 'Yes', onPress: restorePurchases }])}>
                     <Text style={styles.buttonText}>Restore Purchases</Text>
                </TouchableOpacity>
                 </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // container: {
    // flex: 1,
    // backgroundColor: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
    // },

    button: {
    height: 30,
    marginVertical: 10,
    backgroundColor: 'grey',
    paddingHorizontal: 15,
    borderRadius: 25,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    },
    instructionText: {
    color: 'black',
    margin: 10,
    padding: 15,
    alignItems: 'center',
    },
    buttonMiddle: {
    alignItems: 'center',
    }
    // button: {
    //     width: '80%',
    //     backgroundColor: 'white',
    //     borderRadius: 25,
    //     height: 50,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     marginTop: 20,
    //     },
    });
    
    export default InstructionPage;

    