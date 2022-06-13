import { 
  KeyboardAvoidingView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  ScrollView
 } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../../../firebase'
import { useNavigation } from '@react-navigation/core'
import Game from "../Game/Game";
import { colors } from "../../constants";
import { getDayOfYear, setLetters } from "../../utils";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    const unsubsscribe = auth.onAuthStateChanged( user => {
      if (user) {
        navigation.replace('Six(S)')
      }
    })

    return unsubsscribe
  }, [])

  const handleSignUp = () => {
    auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log(user.email)
    })
    .catch(error => alert.apply(error.message))
  }

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message))
  }

  return (
    <ScrollView>
    <KeyboardAvoidingView
    style={styles.container}
    behavior='padding'
    >
        
        <View style={styles.container}>
            <Text style = {styles.instructions}>
                The goal of Six(S) is to find six words with the ten letters provided.
                The scores are beneath the letters, and the 'S' will always be worth 6.
                The magenta squares are worth double, and six letter words are worth
                double as well.  {'\n'}
                The time remaining will be shown with your score, but don't worry, if 
                you can't solve it in 6 minutes, you can keep playing.
                {'\n'}
                {/* Hard Mode only awards double letter scores for the same letter in the magenta 
                squares. 
                {'\n'} */}
                Everyone plays the same daily letters. Practice is available.
                {'\n'} {'\n'}See if you can beat the Max Score!
            </Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput
            placeholder='Email'
            value={email}
            onChangeText={text => setEmail(text) }
            style={styles.input}
            />
            <TextInput
            placeholder='Password'
            value={password}
            onChangeText={text => setPassword(text) }
            style={styles.input}
            secureTextEntry
            />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
          >
          <Text style={styles.buttonText}> Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.buttonOutline]}
          >
          <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
           onPress={ () => 
            navigation.navigate('Game', {letters: setLetters(), gameState: 'practice' })
             }
            style={[styles.button, styles.buttonOutline]}
          >
          <Text style={styles.buttonOutlineText}>Play Daily</Text>
          </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 3,
    // borderColor: colors.lightgrey,
    backgroundColor: colors.darkgrey,
    padding: 20,
    paddingTop: 40
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#661538',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#661538',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#661538',
    fontWeight: '700',
    fontSize: 16,
  },
  instructions: {
    alignItems: 'center',  
    justifyContent: 'center',
    
    color: colors.lightgrey,
    
    fontSize: 20,
    
},
})