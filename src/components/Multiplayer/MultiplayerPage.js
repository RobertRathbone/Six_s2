import React, { useState, useEffect } from 'react';
import setLetters from '../../utils';
import Peer from 'peerjs';
import { StyleSheet, Text,  SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants';
import Game from '../Game/Game';

const Multiplayer = () => {
  const [peer, setPeer] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [multiLetters, setMultiLetters] = useState([]);
  const [peerId, setPeerId] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const getPeerId = async () => {
      const response = await fetch('/get-peer-id');
      const peerId = await response.text();
      return peerId;
    };

    const setupPeer = async () => {
      const peerId = await getPeerId();

      const peer = new Peer(peerId, {
        host: '/',
        port: '8080'
      });

      peer.on('open', () => {
        setPeer(peer);
        setPeerId(peer.id);
      });

      peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          if (data.type === 'letters') {
            setMultiLetters(data.payload);
          } else if (data.type === 'score') {
            setScore(data.payload);
          } else if (data.type === 'time') {
            setTime(data.payload);
          }
        });
      });

      return () => {
        peer.disconnect();
      };
    };

    setupPeer();
  }, []);

  const chooseLetters = () => {
    setMultiLetters(setLetters());
  };

  const connectToPeer = (peerId) => {
    const conn = peer.connect(peerId);

    conn.on('open', () => {
      conn.send({ type: 'letters', payload: multiLetters });
      conn.send({ type: 'score', payload: score });
      conn.send({ type: 'time', payload: time });

      conn.on('data', (data) => {
        if (data.type === 'letters') {
          setMultiLetters(data.payload);
        } else if (data.type === 'score') {
          setScore(data.payload);
        } else if (data.type === 'time') {
          setTime(data.payload);
        }
      });
    });
  };

    const goToGame = () => {
        navigation.navigate('Game', { letters: multiLetters, gameState: 'playing', challenge: true, noTimer: false });
      };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
        <p>Peer ID: {peerId}</p>
        <p>Letters: {multiLetters.join(',')}</p>
        <p>Score: {score}</p>
        <p>Time: {time}</p>
        <button style={styles.button} onClick={chooseLetters}>Set Letters</button>
        <button style={styles.button} onClick={() => connectToPeer('<remote-peer-id>')}>Connect to Peer</button>
        <button style={styles.button} onClick={goToGame}>Go to Game</button>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'grey',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scroll: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 60,
    },
    button: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 25,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      },
      });

export default Multiplayer;

