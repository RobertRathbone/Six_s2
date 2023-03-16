import { useEffect, useState  } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator, ScrollView, Pressable, SafeAreaView  } from 'react-native';
import { colorsToEmoji, colors, CLEAR, ENTER } from '../../constants';;
import Keyboard from '../Keyboard';
import { copyArray, getDayOfYear, getDayOfYearKey, setLetters } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import words from '../../utils/words';
import LetterList from '../../utils/LetterList';
import FinalPage from '../FinalPage';
import Animated, {
    slideInDown, 
    SlideInLeft, 
    ZoomIn,
    FlipInEasyY
  } from 'react-native-reanimated';
 import { Dimensions } from 'react-native';
// import Purchases from 'react-native-purchases';

const NUMBER_OF_TRIES  = 8;


const dayOfTheYear = getDayOfYear();
const dayOfTheYearKey = getDayOfYearKey();
const dayKey = `day-${dayOfTheYearKey}`
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const Game = ({route, navigation}) => {
  const { letters } = route.params;
  const { gameState } = route.params;
  const [rows, setRows] = useState(
    new Array(6).fill(new Array(6).fill(''))); // creates 2D array of empty boxes
  const[scoreArray, setScoreArray] = useState(
    new Array(6).fill(new Array(6).fill(0)));
  const[shareArray, setShareArray] = useState(
    new Array(6).fill(new Array(6).fill('J')));
  const[doubleArray, setDoubleArray] = useState(
    new Array(6).fill(new Array(6).fill('J')));
  const [SCheckArray, setSCheckArray] = useState(
    new Array(6).fill(0));
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameStatePlay, setGameStatePlay] = useState('playing');
  const [loaded, setLoaded] = useState(false);
  const [dayLetters, setDayLetters] = useState(letters);
  const [timerCount, setTimer] = useState(360);
  const [showScore, setShowScore] = useState(0);
  const [row0Score, setRow0Score] = useState(0);
  const [row1Score, setRow1Score] = useState(0);
  const [row2Score, setRow2Score] = useState(0);
  const [row3Score, setRow3Score] = useState(0);
  const [row4Score, setRow4Score] = useState(0);
  const [row5Score, setRow5Score] = useState(0);
  const [showMaxScore, setShowMaxScore] = useState(0);
  const [highScores, setHighScores] = useState([]);
  const [purpleShare, setPurpleShare] = useState(0);
  var [sDouble, setSDouble] = useState(0);
  let double = false;
  let x = 1;
  let y = 1;
  let z = 1;
  let w = 1;
  let mounted = true;
  var score = 0;
  
  
  const letterForYear =[];

  const setGreyCaps = () => {
    var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
      for (let i = 0; i<12; i++){
          if (alphabet.includes(letters[i])){
              alphabet.splice(alphabet.indexOf(letters[i]),1);
          };
      };
      return alphabet;
  };

  useEffect(() => {
    if (timerCount <= 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerCount]);


  useEffect(() => {
    if (loaded) {   
       persistState();
       setShowScore(row0Score + row1Score + row2Score + row3Score + row4Score + row5Score);
      }
  }, [rows, curRow, curCol]);

  useEffect(() => {
    readState();
    maxScore();
  }, []);


const persistState = async () => {
  if (gameState == 'playing'){
    const dataForToday = {
      dayOfTheYear,
      rows, 
      curRow, 
      curCol, 
      gameStatePlay, 
      dayLetters, 
      score, 
      timerCount
    };
    try {
      const existingStateString = await AsyncStorage.getItem('@game');
      const existingState =  existingStateString ? JSON.parse(existingStateString) : {};

      existingState[dayKey] = dataForToday;
      const dataString = JSON.stringify(existingState);
      await AsyncStorage.setItem('@game', dataString);
    } catch (e) {
    console.log('Failed to write data to async storage', dayKey);
    }
  }
    else {

    console.log('gameState not playing')
    };
};

const readState = async () => {
  if (gameState != 'practice'){
  const dataString = await AsyncStorage.getItem('@game');
  console.log('reading')
  try {
    const data = JSON.parse(dataString);
    const day = data[dayKey];
    setRows(day.rows);
    setCurCol(day.curCol);
    setCurRow(day.curRow);
    setGameStatePlay(day.gameStatePlay);
    setDayLetters(day.dayLetters);
    setShowScore(day.score);
    setTimer(day.timerCount);
  } catch (e) {
    console.log('Could not parse the state', e, dayKey);
  }
  setLoaded(true)
}
 else if (gameState == 'practice') {
   console.log('reading practice')
   setPurpleShare(1)
  setLoaded(true)
}
}


const SCheck = (rows, showScore) => {
  let SCount = 0;
  let SCountArray =[];
  for (let i=0; i< rows.length; i++){
    for (let j=0; j< rows[i].length; j++) {

      if (rows[i][j] == letters[9]){
        SCount ++
      } 
    }

    console.log('Scount', SCount)
    SCountArray.push(SCount)
    console.log('Scountarray', SCountArray)
    SCount = 0;
    if (JSON.stringify(SCountArray) === JSON.stringify([1,1,1,1,1,1])){
      double = true;
      setShowScore(showScore *2);
    }
  }

}

const scoreRow = (word, row) => {
  const updatedScoreArray = copyArray(scoreArray);
  const updatedShareArray = copyArray(shareArray);
  const doubleShareArray = copyArray(shareArray);
  var sCount = 0;
  
    for (let i = 0; i< word.length; i++){
        var addToScore =0;
        var x = 1;
        if (row==0 && i == 0 || 
            row==3 && i == 5 ||
            row==4 && i == 4 ||
            row==5 && i == 3 ){
            x = 2;
        }
        if (word[i] == letters[0] ||
            word[i] == letters[2] ||
            word[i] == letters[2] ||
            word[i] == letters[3] ) {
            addToScore =  (1 * x);
            }
        else if ( word[i] == letters[4]) {
            addToScore =  (2 * x);
        }
        else if (word[i] == letters[5]) {
            addToScore =  (3 * x);
        }
        else if (word[i] == letters[6]) {
            addToScore = (4 * x);
        }
        else if (word[i] == letters[7]) {
            addToScore =  (5 * x);
        }
        else if (word[i] == letters[8]) {
            addToScore = (6 * x);
        }
        else if (word[i] == letters[9] && sCount == 0) {
            addToScore =  (6 * x);
            sCount ++;
            setSDouble(sDouble + 1);
            if (row == 1){
              setSDouble(1);
              }
        }
        else if (word[i] == letters[9] && sCount > 0) {
          addToScore =  (1 * x);
          setSDouble(100);
      }
        score = score + addToScore;
        
        updatedScoreArray[row][i]= addToScore;
        updatedShareArray[row][i]= getShareScoreColor(addToScore);
        doubleShareArray[row][i] = getShareScoreColor(addToScore *2)
    }
   
    if (word.length == 6){
        score = score *2;
    }
    if (sDouble >= 6){
      score = score * 2;
    }
    if (sDouble >= 100){
      score = score/2
    }
    setScoreArray(updatedScoreArray);
    setShareArray(updatedShareArray);
    setDoubleArray(doubleShareArray);
    return score;
}

  const maxScore = () => {
    const updatedHighScores = copyArray(highScores);
      const found = [];
      var maxScore0 = 0;
      var maxScore1 = 0;
      var maxScore2 = 0;
      var maxScore3 = 0;
      var maxScore4 = 0;
      var maxScore5 = 0;
      var temp = 0;
      let notMe = 0;
    for (let i = 0; i<15006; i++){
        notMe = 0;
        let word1 = words[i].split("");
        for (let j = 0; j<word1.length; j ++ ){
            if (!letters.includes(word1[j])){
                notMe = 1;
                break;
            }
        }
        if (notMe == 0){
            if (!found.includes(words[i])){
                found.push(words[i])
            }
        }
    }
    for (let i = 0; i<found.length; i++){
        for (let j=0; j<6; j++){
        scoreRow(found[i],j)

        if (j==0){
            if (score> maxScore0 &&
                found[i] != highScores[1] &&
                found[i] != highScores[3] &&
                found[i] != highScores[4] &&
                found[i] != highScores[5] &&
                found[i] != highScores[2] 
                ){
                maxScore0 = score;
                updatedHighScores[0]=found[i];
                score = 0;
                break;
            }
        }
        else if (j==3){
            if (score> maxScore3 &&
                found[i] != highScores[0] &&
                found[i] != highScores[1] &&
                found[i] != highScores[4] &&
                found[i] != highScores[5] &&
                found[i] != highScores[2] 
                ){
                maxScore3 = score;
                updatedHighScores[3]=found[i];
                score = 0;
                break;
            };
        }
        else if (j==4){
            if (score> maxScore4 &&
                found[i] != highScores[0] &&
                found[i] != highScores[3] &&
                found[i] != highScores[1] &&
                found[i] != highScores[5] &&
                found[i] != highScores[2] 
                ){
                maxScore4 = score;
                updatedHighScores[4]=found[i];
                score = 0;
                break;
            };
        }
        else if (j==5){
            if (score> maxScore5 &&
                found[i] != highScores[0] &&
                found[i] != highScores[3] &&
                found[i] != highScores[4] &&
                found[i] != highScores[1] &&
                found[i] != highScores[2] 
                ){
                maxScore5 = score;
                updatedHighScores[5]=found[i];
                score = 0;
                break;
            };
        }
        else if (score > maxScore1 && 
            found[i] != highScores[0] &&
            found[i] != highScores[3] &&
            found[i] != highScores[4] &&
            found[i] != highScores[5] &&
            found[i] != highScores[2] 
            ){
            maxScore1 = score;
            updatedHighScores[1] = found[i];
            score = 0;
            break;
        }
        else if (score > maxScore2 && 
            found[i] != highScores[0] &&
            found[i] != highScores[1] &&
            found[i] != highScores[3] &&
            found[i] != highScores[4] &&
            found[i] != highScores[5] 
            ){
            maxScore2 = score;
            updatedHighScores[2] = found[i];
            score = 0;
            break;
        };
        score = 0;
        setHighScores(updatedHighScores);
        };
      setShowMaxScore(maxScore0 + maxScore1 + maxScore2 + maxScore3 + maxScore4 + maxScore5);
      
    }
    score = maxScore0 + maxScore1 + maxScore2 + maxScore3 + maxScore4 + maxScore5
  };

  const checkWord = (rowWord) => {
    const updatedRows = copyArray(rows);
    if (words.includes(rowWord)){
       scoreRow(rowWord, curRow)
        if (curRow == 0){
            setRow0Score(score);
        } else if (curRow == 1)
            {setRow1Score(score)
        } else if (curRow == 2)
            {setRow2Score(score);
        } else if (curRow == 3)
            {setRow3Score(score);
        } else if (curRow == 4)
            { setRow4Score(score);
        } else if (curRow == 5)
            { setRow5Score(score);
        } 
        score = 0;
        setShowScore(row0Score + row1Score + row2Score + row3Score + row4Score + row5Score);
        return true;
    } else {
        Alert.alert(`${rowWord} is not a word`, 'Try again');
        updatedRows[curRow][curCol - 1] = '';
        updatedRows[curRow][curCol - 2] = '';
        updatedRows[curRow][curCol - 3] = '';
        updatedRows[curRow][curCol - 4] = '';
        updatedRows[curRow][curCol - 5] = '';
        updatedRows[curRow][curCol - 6] = '';
        setRows(updatedRows);
        setCurRow(curRow);
        setCurCol(0);
        return;
    }
  }



  const onKeyPressed = (key) => {
    if (gameState == 'playing' || gameState == 'practice')
    {
    const updatedRows = copyArray(rows);

    if (key === CLEAR){
      const prevCol = curCol - 1;
      if (prevCol >=0){
        updatedRows[curRow][prevCol] = '';
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }

    if (key === "↑"){
        if (curRow > 0){
            setCurRow(curRow - 1);
        } else {
            setCurRow(curRow);
            setCurCol(curCol);
        }
        return;
      }    
      if (key === "↓"){
          if (curRow < 5){
            setCurRow(curRow + 1);
          }
        return;
      }    

    if (key === ENTER) {
        const rowWord = rows[curRow].toString().replace(/,/g,"");
        for (let i = 0; i< 6; i ++){
            if (rowWord == rows[i].toString().replace(/,/g,"") && curRow != i){
                updatedRows[curRow][curCol - 1] = '';
                updatedRows[curRow][curCol - 2] = '';
                updatedRows[curRow][curCol - 3] = '';
                updatedRows[curRow][curCol - 4] = '';
                updatedRows[curRow][curCol - 5] = '';
                updatedRows[curRow][curCol - 6] = '';
                setRows(updatedRows);
                setCurCol(0);
                Alert.alert('Same Word Used', `In Row ${i+1}`)
                return;
            }
        }
        if (curRow<6){
            setCurRow(curRow + 1);
        }
        checkWord(rowWord);
        setCurCol(0);
        return;
    }

    if (curCol <rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol +1);
    }
  }
}

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  }

  const bonusCell = (row, col) => {
      return (row+col)%8!=0
  }

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];
    if (row === 1 || row === 2){
        return;
    }
    if (row >= curRow){
      return colors.darkgrey;
    }
    if (row === 0 && col === 0) {
      return colors.magenta;
    }
    if (row === 3 && col === 5) {
        return colors.magenta;
      }
      if (row === 4 && col === 4) {
        return colors.magenta;
      }
      if (row === 5 && col === 3) {
        return colors.magenta;
      }

    return colors.darkgrey
  };

  const getShareScoreColor =(addToScore) => {
    console.log ('#########double ######### ', double, addToScore)
    if (double == true){
      addToScore = addToScore *2;
      console.log('added ', addToScore)
    }
    if (addToScore == 0){
      return "J";
    }
    if (addToScore == 1){
      return "J";
    }
    if (addToScore == 2){
      return "K";
    }
    if (addToScore == 3){
      return "L";
    }
    if (addToScore == 4){
      return "M";
    }
    if (addToScore == 5){
      return "N";
    }
    if (addToScore == 6){
      return "O";
    }
    if (addToScore == 8){
      return "P";
    }
    if (addToScore == 10){
      return "Q";
    }
    if (addToScore > 11){
      return "R";
    }
  }

  const greyCaps = setGreyCaps();

  if (!loaded){
    return (<ActivityIndicator />)
  }

  if (gameState != 'playing'){
    if (gameState === 'practice'){
    
      // readState();
    } else {
    return (<FinalPage won={gameState === 'won'} 
    rows = {rows}
    highScores ={highScores} 
    score = {showScore}
    highscore = {showMaxScore}
    shareArray = {shareArray}
    purpleShare = {purpleShare}
    />)
    }
  }

  if (gameStatePlay === 'won'){
    return (<FinalPage won={gameState === 'won'} 
    rows = {rows}
    highScores ={highScores} 
    score = {showScore}
    highscore = {showMaxScore}
    shareArray = {shareArray}
    purpleShare = {purpleShare}
    />)
  }

  const amDone = () => {
    console.log('running SCHECK', shareArray[0][0]);
    SCheck(rows, showScore);
    if (double == true){
      setShareArray(doubleArray);
      console.log('******************** Ganger! *****************')
    }
    if (gameState === 'practice'){
      setPurpleShare(1);
    }
    else if ( gameState === 'playing'){
      setPurpleShare(0);
    }
    console.log("One", purpleShare);
    setGameStatePlay('won');
    navigation.setParams({
      gameState: 'won',
    });
    // gameState = 'won';
    // shareScore();
    return;
  }

  return (
      <>
      <ScrollView>
      <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
        <View style= {styles.container}>
        <Animated.Text entering={SlideInLeft.delay(300)} style={styles.title}>{letters}</Animated.Text>
        <Animated.Text entering={SlideInLeft.delay(600)} style={styles.subtitle}>1111234566</Animated.Text>
        
        <Animated.View style ={{ flexDirection: 'row' }} entering={SlideInLeft.delay(1000)}>
          <Text style={{width: '30%', color: colors.lightgrey, fontSize: 18}}>Timer: {timerCount}</Text>
          <Text style={{width: '30%', color: colors.lightgrey, fontSize: 18}}>Max: {showMaxScore}</Text>
          <Text style={{width: '30%', color: colors.lightgrey, fontSize: 18 }}>Score: {showScore}</Text>
        </Animated.View>
        <View style={styles.map}> 
        
          {rows.map((row, i) => 
            <Animated.View entering={SlideInLeft.delay(i*300)}
            key={`row-${i}`} style ={styles.row}>
            {row.map((letter, j) => (
                <>
                  {i < curRow && (
                < Animated.View entering={FlipInEasyY.delay(j*50)}  key={`cell-color-${i}-${j}`}               
                style={[styles.cell, {borderColor: isCellActive(i,j)
                  ? colors.grey
                  : colors.darkgrey,
                  backgroundColor: bonusCell(i,j)
                  ? colors.black
                  : '#661538',
                  }]}>
                  <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                </Animated.View>
                )}
                {i >= curRow && (
                <View key={`cell-${i}-${j}`} 
                style={[styles.cell, {borderColor: isCellActive(i,j)
                  ? colors.grey
                  : colors.darkgrey,
                  backgroundColor: bonusCell(i,j)
                  ? colors.black
                  : '#661538',
                  },
                  ]}>
                  <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                </View>
                )}
              </>
            ))}
          </Animated.View>
          )}
        <Keyboard onKeyPressed={onKeyPressed} 
      //   greenCaps={greenCaps}
      //   yellowCaps={yellowCaps}
        greyCaps={greyCaps}
        />
      <View style={{ alignItems: 'center', padding: 10 }}>
          <Pressable style={styles.amDoneButton} onPress={amDone} >
              <Text style={{ color: colors.lightgrey, fontSize: 20, }}>I am done</Text>
          </Pressable>
      </View>
      </View>
      </View>
      </SafeAreaView>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
    title: {
        color: colors.lightgrey,
        fontSize: 22,
        lineHeight: 30,
        fontWeight: 'bold',
        letterSpacing: 15,
        marginVertical: 10,
        
      },
      subtitle: {
        color: colors.lightgrey,
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 16.5,
        lineHeight: 23,
      },
    map: {
      alignSelf: 'stretch',
      height: 'auto',
    },
    row: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      justifyContent: 'center',
  
    },
    cell:{
      borderWidth: 1,
      borderColor: colors.darkgrey,
      flex: 1,
      maxWidth: '11%',
      aspectRatio: 1,
      margin:5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cellText: {
      color: colors.lightgrey,
      fontSize: 26,
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
  });

export default Game;



// function to make an array of letters for daily use over the course of a year

//   const pickLetterForYear = () => {
//     for ( let i = 0; i<300; i++){
//         letters = setLetters();
//         maxScore()
//         if (score > 320){
//             console.log(letters);
//         } score = 0;
//     }
//   }

{/* Letter pick function Button */}
{/* <Button style={styles.amDoneButton} onPress={pickLetterForYear} 
    title = "Pick Letters">
</Button> */}