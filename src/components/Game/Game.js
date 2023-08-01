import { useEffect, useState, React, Fragment  } from 'react';
import { StyleSheet, 
  Text, 
  View, 
  Alert, 
  ActivityIndicator, 
  ScrollView, 
  Pressable, 
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback } from 'react-native';
import { colorsToEmoji, colors, CLEAR, SCORE } from '../../constants';;
import Keyboard from '../Keyboard';
import { copyArray,
  getDayOfYear,
  getDayOfYearKey,
  updateMaxScore,
  updateHighScore, 
  updateGameMode,
  incrementScore } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import words1 from '../../utils/words1';
import words2 from '../../utils/words2';
import LetterList from '../../utils/LetterList';
import errorChoices from '../../utils/errorChoices';
import FinalPage from '../FinalPage';
import Animated, {
    slideInDown, 
    SlideInLeft, 
    ZoomIn,
    FlipInEasyY
  } from 'react-native-reanimated';
 import { Dimensions } from 'react-native';
 import { useDispatch, useSelector } from 'react-redux';
//  import { useNavigation } from '@react-navigation/native';
// import Purchases from 'react-native-purchases';

const NUMBER_OF_TRIES  = 6;


const dayOfTheYear = getDayOfYear();
const dayOfTheYearKey = getDayOfYearKey();
const dayKey = `day-${dayOfTheYearKey}`
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const dailyLetters = LetterList[dayOfTheYear];



const Game = ({route, navigation}) => { 
  const { letters, gameState} = route.params;
  const [rows, setRows] = useState(
    new Array(6).fill(new Array(6).fill(''))); // creates 2D array of empty boxes
  const blank = new Array(6).fill(new Array(6).fill('')); 
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
  const [gameStartedDate, setGameStartedDate] = useState(null); 
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
  const [currentDay, setCurrentDay] = useState(getDayOfYear());
  const [highScore, setHighScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [highScorePercentage, setHighScorePercentage] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastPlayedDate, setLastPlayedDate] = useState(null);
  const [dayOfHighScore, setDayOfHighScore] = useState(0);
  const [highScoreShareArray, setHighScoreShareArray] = useState(
    new Array(6).fill(new Array(6).fill(0)));
  const challenge = useSelector(state => state.challenge);
  const noTimer = useSelector(state => state.noTimer);
  const dispatch = useDispatch();
  const randomIndex = Math.floor(Math.random() * errorChoices.length);
  let double = false;
  let x = 1;
  let y = 1;
  let z = 1;
  let w = 1;
  let mounted = true;
  var score = 0;
  const letterForYear =[];

  // picks the usable letters for the game
  const setGreyCaps = () => {
    var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
      for (let i = 0; i<12; i++){
          if (alphabet.includes(letters[i])){
              alphabet.splice(alphabet.indexOf(letters[i]),1);
          };
      };
      return alphabet;
  };

  // timer
  useEffect(() => {
    if (timerCount <= 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerCount]);

  // running count of users score
  useEffect(() => {
    if (loaded) {   
       persistState();
       setShowScore(row0Score + row1Score + row2Score + row3Score + row4Score + row5Score);
      }
  }, [rows, curRow, curCol]);

  // keeper of the high score
  useEffect(() => { 
    readState();
    if (challenge){ 
      maxScore(words2);
      console.log(highScores[0])
    }
    else {
      maxScore(words1);
      console.log('useEffect', highScores)
    }
    
    
  }, []);

  // change letters of daily when day changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDay(getDayOfYear());
    }, 60 * 5000); // update the day every five minutes
  
    return () => clearInterval(intervalId);
  }, []);

  // keep the daily letters and guesses in state
  const persistState = async () => {
    try {
      const dataString = await AsyncStorage.getItem('@game');
      const data = JSON.parse(dataString);
      const day = data[dayKey];
      const currentDay = getDayOfYear(); 
      if (day && day.dayOfTheYear !== currentDay) {
        setRows(blank);
        setCurCol(0);
        setCurRow(0);
        setGameStatePlay('playing');
        setDayLetters(dailyLetters);
        setShowScore(0);
        setTimer(360);
      }
} catch (e) {

  }
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

// get daily values from state
const readState = async () => {
  if (gameState != 'practice'){
  const dataString = await AsyncStorage.getItem('@game');
  try {
    const data = JSON.parse(dataString);
    const day = data[dayKey];
    if (day == undefined){
      setRows(blank);
      setCurCol(0);
      setCurRow(0);
      setGameStatePlay('practice');
      setDayLetters(dailyLetters);
      setShowScore(0);
      setTimer(360);;
    }else {
    setRows(day.rows);
    setCurCol(day.curCol);
    setCurRow(day.curRow);
    setGameStatePlay(day.gameStatePlay);
    setDayLetters(day.dayLetters);
    setShowScore(day.score);
    setTimer(day.timerCount);
    }
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

useEffect(() => {
  async function loadData() {
    try {
      const storedHighScore = await AsyncStorage.getItem('highScore');
      const storedHighestScore = await AsyncStorage.getItem('highestScore');
      const storedDailyStreak = await AsyncStorage.getItem('dailyStreak');
      const storedLastPlayedDate = await AsyncStorage.getItem('lastPlayedDate');
      const storedHighScorePercentage = await AsyncStorage.getItem('highScorePercentage');
      const storedShareArray = await AsyncStorage.getItem('highScoreShareArray');
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
      }
      if (storedShareArray !== null) {
        setHighScoreShareArray(JSON.parse(storedShareArray));
      }
      if (storedDayOfHighScore !== null) {
        setDayOfHighScore(parseInt(dayOfHighScore));
      }
    } catch (error) {
      console.log(error);
    }
  }
  loadData();
}, []);

const updateScore = async (score) => {
  try {
    if (score > highScore) {
      setHighScore(score);
      await AsyncStorage.setItem('highScore', score.toString());
    }
    if (score >= highestScore) {
      setHighestScore(score);
      console.log('day of the year? ',dayOfTheYear);
      await AsyncStorage.setItem('highestScore', score.toString());
      await AsyncStorage.setItem('highScoreShareArray', JSON.stringify(shareArray));
      await AsyncStorage.setItem('dayOfHighScore', dayOfTheYear.toString());
      const cloak = await AsyncStorage.getItem('highScoreShareArray');
      console.log('cloak', cloak);
    }
    if (score/showMaxScore > highScorePercentage) {
      setHighScorePercentage((score/showMaxScore) * 100);
      await AsyncStorage.setItem('highScorePercentage', (score/showMaxScore).toString());
    }

    const today = new Date();
    if (lastPlayedDate === null || lastPlayedDate.toDateString() !== today.toDateString()) {
      // Reset the daily streak if the game was not played today
      if (lastPlayedDate !== null && lastPlayedDate < today) {
        setDailyStreak(0);
      }

      // Increment the daily streak and update the last played date
      setDailyStreak(dailyStreak + 1);
      setLastPlayedDate(today);
      await AsyncStorage.setItem('dailyStreak', (dailyStreak + 1).toString());
      await AsyncStorage.setItem('lastPlayedDate', today.toISOString());
    }
  } catch (error) {
    console.log(error);
  }
};


// press keyboard
const onCellPress = (rowIndex, colIndex) => {
  setCurRow(rowIndex);
  setCurCol(colIndex);
};

// for challenge mode, check for exactly one S per row
const SCheck = (rows, showScore) => {
  let SCount = 0;
  let SCountArray =[];
  for (let i=0; i< rows.length; i++){
    for (let j=0; j< rows[i].length; j++) {
      if (rows[i][j] == letters[9]){
        SCount ++
      } 
    }
    SCountArray.push(SCount)
    SCount = 0;
    if (JSON.stringify(SCountArray) === JSON.stringify([1,1,1,1,1,1]) && challenge ){
      double = true;
      setShowScore(showScore *2);
    }
  }

}

// classic scoring
const regularScoreRow = (word, row) => {
  const updatedScoreArray = copyArray(scoreArray);
  const updatedShareArray = copyArray(shareArray);
    
    for (let i = 0; i< word.length; i++){
      updatedScoreArray[row][i]= addToScore; // reset to 0 in case player changes word, so it won't score twice
        var addToScore =0;
        var x = 1;
        if (row==0 && i == 0 || 
            row==3 && i == 5 ||
            row==4 && i == 4 ||
            row==5 && i == 3 ){
            x = 2;
        }
        if (word[i] == letters[0] ||
            word[i] == letters[1] ||
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
        else if (word[i] == letters[9]) {
            addToScore =  (6 * x);
        }
        score = score + addToScore;
        
        updatedScoreArray[row][i]= addToScore;
        updatedShareArray[row][i]= getShareScoreColor(addToScore);
    }
   
    if (word.length == 6){
        score = score *2
    }
    // console.log('updatedScoreArray', updatedShareArray);
    setScoreArray(updatedScoreArray);
    setShareArray(updatedShareArray);
    setSCheckArray(updatedShareArray)
    console.log('shareArray', shareArray)
    return score;
}

// challenge scoring, different because different dictionary (just one S)
const scoreRow = (word, row) => {
  const updatedScoreArray = copyArray(scoreArray);
  const updatedShareArray = copyArray(shareArray);
  const doubleShareArray = copyArray(shareArray);
  var sCount = 0;
  
    for (let i = 0; i< word.length; i++){
      updatedScoreArray[row][i]= 0;
        var addToScore =0;
        var x = 1;
        if (row==0 && i == 0 || 
            row==3 && i == 5 ||
            row==4 && i == 4 ||
            row==5 && i == 3 ){
            x = 2;
        }
        if (word[i] == letters[0] ||
            word[i] == letters[1] ||
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
    if (sDouble >= 6 && challenge){
      console.log('##########SDOUBLE#########')
      console.log('challenge', challenge)
      score = score * 2;
    }
    if (sDouble >= 100){
      score = score/2
    }
    // console.log('updatedScoreArray', updatedScoreArray, row);
    setScoreArray(updatedScoreArray);
    setShareArray(updatedShareArray);
    setSCheckArray(updatedShareArray)
    setDoubleArray(doubleShareArray);
    return score;
}

  // find high scoring words and score for both modes dictionary changes by input
  const maxScore = (words) => {
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
    for (let i = 0; i<words.length; i++){
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
        if (challenge) {
          setShowMaxScore(2*(maxScore0 + maxScore1 + maxScore2 + maxScore3 + maxScore4 + maxScore5));
        }
        else {
          setShowMaxScore(maxScore0 + maxScore1 + maxScore2 + maxScore3 + maxScore4 + maxScore5);
        }
    }
    score = maxScore0 + maxScore1 + maxScore2 + maxScore3 + maxScore4 + maxScore5

  };

  // word validation
  const checkWord = (rowWord, words) => {
    const updatedRows = copyArray(rows);
    if (challenge){
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
        Alert.alert(`${rowWord}`, errorChoices[randomIndex]);
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
    else {
      if (words.includes(rowWord)){
        regularScoreRow(rowWord, curRow)
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
  }

  // what happens when you press a key
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
            if (curRow === 6){
              setCurRow(5);
            }
          }
          if (curRow === 6){
            setCurRow(5);
          }
        return;
      }    

    if (key === SCORE) {
      if (curRow === 6 || curRow === 'undefined'){
        setCurRow(0);
      } else {
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
        if (curRow === 6){
          setCurRow(5);
        }
        checkWord(rowWord, words1);
        setCurCol(0);
        return;
      };
      return;
    };

    if (curCol <rows[0].length) {
      // if (curCol === 7){
      //   setCurCol(6)
      // }
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      if (curCol < 7) {
        setCurCol(curCol + 1);
      }
    }
  }
}

  // outline the active cell
  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  }

  // designate bonus squares
  const bonusCell = (row, col) => {
      return (row+col)%8!=0
  }

  // the sharing color block is a font. So letters that correlate with the scores are used
  // to populate the share array.
  const getShareScoreColor =(addToScore) => {
    // console.log ('#########double ######### ', double, addToScore)
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

  // playing = daily and practice = unlimited
  if (gameState != 'playing'){
    if (gameState === 'practice'){
    
      // readState();
    } else {
    return (<FinalPage won={gameState === 'won'} 

    rows = {rows}
    highScores ={highScores} 
    score = {showScore}
    highscore = {showMaxScore}
    shareArray = {SCheckArray}
    purpleShare = {purpleShare}
    time = {timerCount}
    />)
    }
  }

  if (gameStatePlay === 'won' ){

   
    return (<FinalPage won={gameState === 'won'} 
    rows = {rows}
    highScores ={highScores} 
    score = {showScore}
    highscore = {showMaxScore}
    shareArray = {SCheckArray}
    purpleShare = {purpleShare}
    time = {timerCount}
    />)
  }

  const amDone = () => {
    console.log('***-----> ', showMaxScore, showScore, gameState);
    SCheck(rows, showScore);
    if (double == true){
      setShareArray(doubleArray);
      updateScore(showScore *2);
      console.log('double', showScore*2)
    } else {
      updateScore(showScore);
      console.log('single', showScore)
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
          {noTimer ? null : <Text style={{width: '30%', color: colors.lightgrey, fontSize: 14}}>Timer: {timerCount}</Text>}
          <Text style={{width: '25%', color: colors.lightgrey, fontSize: 14}}>Max: {showMaxScore}</Text>
          <Text style={{width: '25%', color: colors.lightgrey, fontSize: 14 }}>Score: {showScore}</Text>
          <Text style={{width: '20%', color: colors.lightgrey, fontSize: 14 }}>{challenge ? 'challenge' : 'regular'}</Text>
        </Animated.View>
        <View style={styles.map}> 
        
        {rows.map((row, i) =>
  <Animated.View entering={SlideInLeft.delay(i * 300)} key={`row-${i}`} style={styles.row}>
    {row.map((letter, j) => (
      <TouchableWithoutFeedback key={`cell-${i}-${j}`} onPress={() => onCellPress(i, j)}>
        <View style={[
          styles.cell,
          {
            borderColor: isCellActive(i, j) ? colors.grey : colors.darkgrey,
            backgroundColor: bonusCell(i, j) ? colors.black : '#661538',
          }
        ]}>
          <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>
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