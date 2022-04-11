import { black } from "color-name";
import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native"
import { colors } from "../../constants";
import Game from "../Game/Game";
import { getDayOfYear, setLetters } from "../../utils";
import LetterList from "../../utils/LetterList";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const dayOfTheYear = getDayOfYear();


const dailyLetters = LetterList[dayOfTheYear];

var shareArray =  
// ['K', 'L', 'M', 'N', 'N', 'P',
// 'K', 'L', 'M', 'N', 'N', 'P',
// 'K', 'L', 'M', 'N', 'N', 'P',
// 'K', 'L', 'M', 'N', 'N', 'P',
// 'K', 'L', 'M', 'N', 'N', 'P',
// 'K', 'L', 'M', 'N', 'N', 'P',
// ]
[ ['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',],
['K', 'L', 'M', 'N', 'N', 'P',]
];


const StartPage = ({ navigation }) => {

    // const Begin = () => {
    //     console.log("pressed")
    //     return (<Game letters ={LetterList[dayOfTheYear]} gameState = 'playing' />);
    //   }
    //   const Hard = () => {
    //     console.log("Done");

    //     return;
    //   }
    //   const Practice = () => {
    //     console.log("Done");

    //     return;
    //   }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style = {styles.instructions}>
                    The goal of Six(S) is to find six words with the ten letters provided.
                    The scores are beneath the letters, and the 'S' will always be worth 6.
                    The magenta squares are worth double, and six letter words are worth
                    double as well.  {'\n'}
                    The time remaining will be shown with your score, but don't worry, if 
                    you can't solve it in 6 minutes, you can keep playing.
                    {'\n'}
                    Hard Mode only awards double letter scores for the same letter in the magenta 
                    squares. 
                    {'\n'}
                    Everyone plays the same daily letters. Practice is available.
                    {'\n'} {'\n'}See if you can beat the Max Score!
                </Text>
                <Text 
                style={{ fontFamily: "frisbeespidercolorbox" }}>
                    JKLMNOPQR
                </Text>
            </View>


            <View style={{ alignItems: 'center', padding: 10 }}>
                <Pressable style={styles.amDoneButton} onPress={ () => 
                navigation.navigate('Game', {letters: dailyLetters, gameState: 'playing' })
                 } >
                    <Text style={{ color: colors.lightgrey, fontSize: 20, }}>Daily</Text>
                </Pressable>
            </View>
            <View style={{ alignItems: 'center', padding: 10 }}>
                <Pressable style={styles.amDoneButton} onPress={ () => 
                navigation.navigate('Game', {letters: setLetters(), gameState: 'practice' })
                 } >
                    <Text style={{ color: colors.lightgrey, fontSize: 20, }}>Practice</Text>
                </Pressable>
            </View>

            {/* <View style={{ alignItems: 'center', padding: 10 }}>
                <Pressable style={styles.amDoneButton} onPress={Hard} >
                    <Text style={{ color: colors.lightgrey, fontSize: 20, }}>Hard</Text>
                </Pressable>
            </View>
            <View style={{ alignItems: 'center', padding: 10 }}>
                <Pressable style={styles.amDoneButton} onPress={Practice} >
                    <Text style={{ color: colors.lightgrey, fontSize: 20, }}>Practice</Text>
                </Pressable>
            </View> */}
        </ScrollView>
        
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 3,
        borderColor: colors.lightgrey,
        backgroundColor: colors.darkgrey,
        padding: 20,
        width: '100%',
        alignItems: 'center',  
        justifyContent: 'center',
    },
    instructions: {
        alignItems: 'center',  
        justifyContent: 'center',
        
        color: colors.lightgrey,
        
        fontSize: 20,
        
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

export default StartPage;