import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRef } from "react";
import { colors } from "../../constants";
import Animated, {
    SlideInLeft, 
    FlipInEasyY
  } from 'react-native-reanimated';
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";


const SharePage = ({ route, navigation }) => {
  const { shareArray } = route.params;
  const viewShot = useRef();
  console.log(shareArray, 'inShare')

  captureAndShareScreenshot = () => {
    viewShot.current.capture().then((uri) => {
    console.log("do something with ", uri);
    Sharing.shareAsync("file://" + uri);
    }),
    (error) => console.error("Oops, snapshot failed", error);
    };

    return (
      <>
      <ViewShot
        ref = {viewShot}
        options={{ format: "jpg", quality: 0.9 }}
      >
      
       <View style={styles.shareArry}>
       <Text> Six(S)</Text>
          {shareArray.map((row, i) => 
            <Animated.View entering={SlideInLeft.delay(i*300)}
            key={`row-${i}`} style ={styles.row}>
            {row.map((letter, j) => (
                <>
                < Animated.View entering={FlipInEasyY.delay(j*50)}  key={`cell-color-${i}-${j}`}               
                style={styles.cell }>
                  <Text style={styles.cellText}>{letter}</Text>
                </Animated.View>
              </>
            ))}
          </Animated.View>
          )}
        </View>

        </ViewShot>

        <Pressable
            style={styles.amDoneButton}
            onPress={captureAndShareScreenshot}
            >
            {/* <Image
            source={require("../../assets/icons/share.png")}
            style={styles.iconImage}
            /> */}
        </Pressable>
        
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
    shareArry: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 100,
    },
    row: {
        // alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'flex-end',

        
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

export default SharePage;