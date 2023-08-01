import React, {useEffect, useState} from 'react';
import { Alert, StyleSheet, Text, Pressable, TouchableOpacity, View, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from "../../constants";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import { useRef } from "react";
import Animated, { SlideInLeft, FlipInEasyY } from "react-native-reanimated";
import { useSelector } from 'react-redux';


const StatPage = () => {
    const viewShot = useRef();
    const [highScore, setHighScore] = useState(0);
    const [highestScore, setHighestScore] = useState(0);
    const [highScorePercentage, setHighScorePercentage] = useState(0);
    const [dailyStreak, setDailyStreak] = useState(0);
    const [lastPlayedDate, setLastPlayedDate] = useState(null);
    const [dayOfHighScore, setDayOfHighScore] = useState(0);
    const [highScoreShareArray, setHighScoreShareArray] = useState(
        new Array(6).fill(new Array(6).fill(0)));
    const [isLoading, setIsLoading] = useState(true);

    var l = 0
    var purpleShare = 0;

    const storedDailyStreak = useSelector(state => state.dailyStreak);
  
    useEffect(() => {
      setDailyStreak(storedDailyStreak);
    }, [storedDailyStreak]);
  
useEffect(() => {
    async function loadData() {
        try {
        const storedShareArray = await AsyncStorage.getItem('highScoreShareArray');
        const storedHighScore = await AsyncStorage.getItem('highScore');
        const storedHighestScore = await AsyncStorage.getItem('highestScore');
        const storedDailyStreak = await AsyncStorage.getItem('dailyStreak');
        const storedLastPlayedDate = await AsyncStorage.getItem('lastPlayedDate');
        const storedHighScorePercentage = await AsyncStorage.getItem('highScorePercentage');
        const storedDayOfHighScore = await AsyncStorage.getItem('dayOfHighScore');
    
        if (storedHighScore !== null) {
            setHighScore(parseInt(storedHighScore));
        }
        if (storedHighestScore !== null) {
            setHighestScore(parseInt(storedHighestScore));
        }
        if (storedDailyStreak !== null) {
            setDailyStreak(parseInt(storedDailyStreak));
        }
        if (storedLastPlayedDate !== null) {
            setLastPlayedDate(new Date(storedLastPlayedDate));
        }
        if (storedHighScorePercentage !== null) {
            setHighScorePercentage(parseFloat(storedHighScorePercentage));
            console.log('before');
        }
        if (storedShareArray !== null) {
            setHighScoreShareArray(JSON.parse(storedShareArray));
            };
            console.log('check here --->', highScoreShareArray)
        if (storedDayOfHighScore !== null) {
            setDayOfHighScore(parseInt(storedDayOfHighScore));
            }

        const currentDate = new Date();
        const storedDate = new Date(storedLastPlayedDate);
        const daysDifference = (currentDate - storedDate) / (1000 * 3600 * 24);
        // const daysDifference = 3; testing
        if (daysDifference === 1) {
            setDailyStreak(parseInt(storedDailyStreak) + 1);
        } else if (daysDifference > 1) {
            setDailyStreak(0);
        }
        } catch (error) {
        console.log(error);
        } finally {
            setIsLoading(false);
          }
    }
    loadData();
    }, []);

    const CellText = ({ letter, opacity }) => {
    const androidOpacity =
        Platform.OS === "android"
        ? (letter.charCodeAt(0) - 73) / 100
        : 1;
    const finalOpacity =
        Platform.OS === "android" ? androidOpacity * opacity : opacity;
    return (
        <Text style={[styles.cellText, { opacity: finalOpacity }]}>
        {String.fromCharCode(letter.charCodeAt(0) - l)}
        </Text>
    );
    };

    const captureAndShareScreenshot = async () => {
    try {
        const uri = await viewShot.current.capture();
        console.log("do something with ", uri);
        await Share.open({ url: uri });
    } catch (error) {
        console.error("Oops, snapshot failed", error);
    }
    };

    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        );
      }

    return (
    <>
        <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", backgroundColor: 'grey' }}
        >
        <ViewShot ref={viewShot}>
        <Text style={styles.title}>
            Highest Score {highestScore} {"\n"}
            Best Percentage of max Score {`${(highScorePercentage * 100).toFixed(0)}%`}{"\n"}
            Current Streak {dailyStreak} {"\n"}
            Highest Score Color Box:
        </Text>
            <View style={styles.shareArry}>
            <Text
                style={[
                styles.scoreText,
                purpleShare ? styles.purpleText : styles.magentaText,
                ]}
            >

                
                Six(S)
            </Text>
            {highScoreShareArray.map((row, i) => (
                <Animated.View
                entering={SlideInLeft.delay(i * 300)}
                key={`row-${i}`}
                style={styles.row}
                >
                {row.map((letter, j) => (
                    <>
                    <Animated.View
                        entering={FlipInEasyY.delay(j * 50)}
                        key={`cell-color-${i}-${j} `}
                        style={styles.cell}
                    >
                        <CellText
                        letter={letter}
                        opacity={(letter.charCodeAt(0) - l) / 7}
                        />
                    </Animated.View>
                    </>
                ))}
                </Animated.View>
            ))}
            <Text
                style={[
                styles.scoreText,
                purpleShare ? styles.purpleText2 : styles.magentaText,
            ]}
                >
            # {`${ dayOfHighScore}`} 
            </Text>
            </View>
        </ViewShot> 

        <View style={styles.shareArry}>  
        <Pressable
            style={purpleShare ? styles.amDoneButtonPurple : styles.amDoneButton}
            onPress={captureAndShareScreenshot}
            >
                <Text style={styles.button}>
                Share
                </Text>
        </Pressable>
        </View>
        </ScrollView>
    </>
    );
        };
const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        padding: 5,
        marginTop: 10,
        color: 'white',
        marginVertical: 20,
    },
    subtitle: {
        fontSize: 20,
        color: colors.lightgrey,
        textAlign: 'center',
        marginVertical: 15,
        fontWeight: 'bold',
    },
    button: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginVertical: 15,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    shareArry: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,

    },
    row: {
        // alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'flex-end',

        
        },
    scoreText:{
        fontSize: 24,
        color: 'grey',

    },
    purpleText:{
        color: '#4c00b0',
        // opacity: time/360 ,
    },
    purpleText2:{
        opacity: 0,
    },
    magentaText:{
        color:colors.magenta,
        justifyContent: 'center',
        alignItems: 'center',
        // opacity: time/360 ,
    },
    cell:{
        // borderWidth: 1,
        // borderColor: colors.darkgrey,
        flex: 1,
        maxWidth: 30,
        aspectRatio: 1,
        // margin:1,
        justifyContent: 'center',
        alignItems: 'center',
        },
        cellText: {
        fontFamily: "frisbeespidercolorbox",
        fontSize: 36,
        },
        amDoneButton: { 
        color: colors.magenta,
        backgroundColor: colors.magenta,
        borderRadius: 15, 
        height: 50,
        width: 140,
        alignItems: 'center',  
        justifyContent: 'center',
    },
    amDoneButtonPurple: { 
        color: '#7B1FA2',
        backgroundColor: '#7B1FA2',
        borderRadius: 15, 
        height: 50,
        width: 140,
        alignItems: 'center',  
        justifyContent: 'center',
    },
})

export default StatPage;

    