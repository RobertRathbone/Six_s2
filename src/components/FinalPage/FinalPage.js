import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { colors } from "../../constants";
import Animated, {
    SlideInLeft, 
    FlipInEasyY
  } from 'react-native-reanimated';
import { white } from "color-name";
import SharePage from "../SharePage";
import { useNavigation } from '@react-navigation/native';


const Number = ({number, label}) => (
    <View style={{ alignItems: 'center', margin: 10 }}>
        <Text style={{ color: colors.lightgrey, fontSize: 30, fontWeight: 'bold' }}>{number}</Text>
        <Text style={{ color: colors.lightgrey, fontSize: 16, }}>{label}</Text>
    </View>
);



const GuessDistributionLine = ({ position, amount, percentage }) => {
    return (
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <Text style={{ color: colors.lightgrey }}>{position}</Text>
        <View
          style={{
            alignSelf: 'stretch',
            backgroundColor: colors.grey,
            margin: 5,
            padding: 5,
            width: `${percentage}%`,
          }}
        >
          <Text style={{ color: colors.lightgrey }}>{amount}</Text>
        </View>
      </View>
    );
  };
  

const bonusCell = (row, col) => {
    return (row+col)%8!=0
}

const GuessDistribution =() => {
    return (
    <>
    <Text style={styles.subtitle}>Guess Distribution</Text>
    <View style={{ width: '100%', padding: 20 }}>
        <GuessDistributionLine position={0} amount ={2} percentage={50}/>
    </View>
    </>
    )   
}

const FinalPage = ({ won = false, rows, score, highscore, highScores, shareArray, purpleShare, time }) => {
    const navigation = useNavigation();
    const [secondsTilTomorrow, setSecondsTilTomorrow] = useState();
    const highScoreArrayFill = highScores.toString().replace(/,/g,'').split('');
    var highScoreArray = [];
    var k = 0;
    for (var i = 0; i < 6; i++) {
        highScoreArray[i] = [];
        for (var j = 0; j < 6; j++) {
          if (highScoreArrayFill[k] === null){
            highScoreArray[i][j] = 'J';
          }else {
            highScoreArray[i][j] = highScoreArrayFill[k];
          }
            k++;
        }
    }
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 6; j++) {
        if (highScoreArray[i][j] === undefined) {
          highScoreArray[i][j] = " ";
        }
      }
    }
    useEffect(() => {
      
      console.log("Final Page", score, purpleShare, time, shareArray)
    },[])
    

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

            setSecondsTilTomorrow(( tomorrow - now) /1000 );
        }; 

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
    }, []);

    const formatSeconds = () => {
        const hours = Math.floor(secondsTilTomorrow / (60*60));
        const minutes = Math.floor((secondsTilTomorrow % (60 * 60))/ 60);
        const seconds = Math.floor(secondsTilTomorrow % 60);
        
    return `${hours}:${minutes}:${seconds}`;
    };


    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            {/* <Text style={styles.title}>
                {won ? 'Congrats' : 'Try again tomorrow'}
            </Text> */}
            <Text style={styles.subtitle}>Your words {`${score}`}</Text>
            {/* <View 
            style={{ flexDirection: 'row', marginBottom: 20 }}
            >
                <Number number ={`${ rows}`} label={'Your Words'} />
                <Number number ={`${score}`} label={'Your Score'} />
                <Number number ={`${highscore}`} label={'Max Score'} />
                <Number number ={`${Array.isArray(highScoreArray[0])}`} label={'High Scoring Words'} />
            </View> */} 

        {rows.map((row, i) => 
          <Animated.View entering={SlideInLeft.delay(i*300)}
          key={`row-${i}`} style ={styles.row}>
          {row.map((letter, j) => (
              <> 
              < Animated.View entering={FlipInEasyY.delay(j*50)}  key={`cell-color-${i}-${j}`}               
              style={[styles.cell, {borderColor: 'grey',
                backgroundColor: bonusCell(i,j)
                ? colors.black
                : '#661538',
                }]}>
                <Text style={styles.cellText}>{letter.length > 0 ? letter.toUpperCase() : ''}</Text>
              </Animated.View>
            </>
          ))}

        </Animated.View>
        
        )}
            <Text style={styles.subtitle}>High Scoring Words {`${highscore}`}</Text>
            {highScoreArray.map((row, i) => 
          <Animated.View entering={SlideInLeft.delay(i*300)}
          key={`row-${i}`} style ={styles.row}>
          {row.map((letter, j) => (
              <> 
              < Animated.View entering={FlipInEasyY.delay(j*50)}  key={`cell-color-${i}-${j}`}               
              style={[styles.cell, {borderColor: 'grey',
                backgroundColor: bonusCell(i,j)
                ? colors.black
                : '#661538',
                }]}>
                <Text style={styles.cellText}>{letter.length > 0 ? letter.toUpperCase() : ''}</Text>
              </Animated.View>
            </>
          ))}
          </Animated.View>
            )}
                <View style={{ flex: 1 }}>
                    <Text style={ purpleShare != 1 ? styles.nextColor : styles.nexxtBlank }>Next Six(S)</Text>
                    <Text style={purpleShare != 1 ? styles.timeColor : styles.timeBlank }>{formatSeconds()}</Text>
                </View>

                <View style={{ padding: 10 }}>
                <Pressable style={styles.amDoneButton} onPress={ () => 
                navigation.navigate('Share', { shareArray: shareArray, score: score, 
                    purpleShare: purpleShare, time: time} )
                 } >
                    <Text style={{ color: colors.lightgrey, fontSize: 20, }}>Share</Text>
                </Pressable>
                
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
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
    row: {
        // alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    
      },
    cell:{
        borderWidth: 2,
        borderColor: colors.darkgrey,
        flex: 1,
        maxWidth: 30,
        aspectRatio: 1,
        margin:2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      nextColor: {
        color: 'lightgrey',
      },
      nexxtBlank: {
        color: 'white',
        opacity: 0,
      },
      timeColor: { 
        color: colors.lightgrey, 
        fontSize: 24, 
        fontWeight: 'bold' 
    },
    timeBlank: {
        color: 'white',
        opacity: 0,
    },
      cellText: {
        color: colors.lightgrey,
        fontSize: 16,
        fontWeight: 'bold',
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
})

export default FinalPage;