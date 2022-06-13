import { black } from "color-name";
import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native"
import { colors } from "../../constants";
import Game from "../Game/Game";
import { getDayOfYear, setLetters } from "../../utils";
import LetterList from "../../utils/LetterList";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from '../../../firebase'


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

    const handleSignOut = () => {
        auth
        .signOut()
        .then(() => {
          navigation.replace('Login')
        })
        .catch(error => alert(error.message))
      }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style = {styles.instructions}>
                    Use the keyboard to spell your words. Hit enter when you have finished a word, that will add to your score. You can use the arrows to move up and down. You can go up and change your word if you want, hit enter for a new score. Hit 'I Am Done' when you are finished.
                    {'\n'}
                    
                    {/* Hard Mode only awards double letter scores for the same letter in the magenta 
                    squares. 
                    {'\n'} */}
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
            <View style={{ alignItems: 'center', padding: 10 }}>
                <Pressable style={styles.amDoneButton} onPress={handleSignOut} >
                    <Text style={{ color: colors.lightgrey, fontSize: 16, }}>Sign Out</Text>
                    <Text style={{ color: colors.lightgrey, fontSize: 8, }}>{auth.currentUser?.email} </Text>
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