import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useRef } from "react";
import Animated, { SlideInLeft, FlipInEasyY } from "react-native-reanimated";
import { colors } from "../../constants";
import { getDayOfYear, getDayOfYearKey, } from '../../utils';
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";

const SharePage = ({ route, navigation }) => {
  const { shareArray, score, purpleShare, time } = route.params;
  const viewShot = useRef();
  const dayO = getDayOfYear();
  // console.log('sharePage', shareArray);
  // console.log("purple? ", purpleShare);
  if (purpleShare == 1) {
    var l = 9;
    console.log("set l ---> ", l);
  } else {
    var l = 0;
  }

  const CellText = ({ letter, opacity }) => {
    const androidOpacity =
      Platform.OS === "android"
        ? (letter.charCodeAt(0) - 73) / 100
        : 1;
    const finalOpacity =
      Platform.OS === "android" ? androidOpacity * opacity : opacity;
    console.log("finalOpacity", finalOpacity, letter.charCodeAt(0));
    console.log("purpleshare", purpleShare, l, l);
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

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <ViewShot ref={viewShot}>
          <View style={styles.shareArry}>
            <Text
              style={[
                styles.scoreText,
                purpleShare ? styles.purpleText : styles.magentaText,
              ]}
            >

              
            {`${ score}`} Six(S)
            </Text>
            {shareArray.map((row, i) => (
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
           # {`${ dayO}`} 
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

export default SharePage;