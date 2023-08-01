// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import { setLetters } from "../../utils";
// import NetInfo from '@react-native-community/netinfo';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Peer from 'react-native-peerjs';

// const MultiplayerPage = ({ navigation, challenge, noTimer }) => {
//   const [letters, setLettersState] = useState(setLetters());
//   const [score, setScore] = useState(0);
//   const [time, setTime] = useState(0);
//   const [isOnline, setIsOnline] = useState(false);
//   const [peerID, setPeerID] = useState('');
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     // Get the letters, score, and time from AsyncStorage
//     const getData = async () => {
//       try {
//         const savedLetters = await AsyncStorage.getItem('letters');
//         const savedScore = await AsyncStorage.getItem('score');
//         const savedTime = await AsyncStorage.getItem('time');

//         if (savedLetters !== null) {
//           setLettersState(JSON.parse(savedLetters));
//         }

//         if (savedScore !== null) {
//           setScore(parseInt(savedScore));
//         }

//         if (savedTime !== null) {
//           setTime(parseInt(savedTime));
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     };

//     getData();

//     // Check if the user is online
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       setIsOnline(state.isConnected);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleConnect = async () => {
//     // Generate a unique peer ID for this user
//     const newPeerID = Math.random().toString(36).substring(7);

//     // Save the peer ID to AsyncStorage
//     try {
//       await AsyncStorage.setItem('peerID', newPeerID);
//       setPeerID(newPeerID);
//     } catch (e) {
//       console.log(e);
//     }

//     // Set up a listener for incoming connections
//     const handleConnection = (connection) => {
//       // Send the letters, score, and time to the other player
//       connection.send(JSON.stringify({ letters, score, time }));

//       // Listen for incoming data from the other player
//       connection.on('data', (data) => {
//         const { otherScore, otherTime } = JSON.parse(data);
//         // Compare the scores and times to determine the winner
//         if (otherScore > score || (otherScore === score && otherTime < time)) {
//           console.log('You lost!');
//         } else {
//           console.log('You won!');
//         }
//       });

//       setIsConnected(true);
//     };

//     // Set up a peer-to-peer connection using the new peer ID
//     const peer = new Peer(newPeerID, { host: 'your-peerjs-server-url', port: 443, secure: true });
//     peer.on('connection', handleConnection);
//   };

//   const handleDisconnect = async () => {
//     // Close the peer-to-peer connection
//     const peer = Peer.getInstance();
//     peer.disconnect();

//     // Clear the saved data from AsyncStorage
//     try {
//       await AsyncStorage.removeItem('letters');
//       await AsyncStorage.removeItem('score');
//       await AsyncStorage.removeItem('time');
//       await AsyncStorage.removeItem('peerID');
//       setLettersState([]);
//       setScore(0);
//       setTime(0);
//       setPeerID('');
//       setIsConnected(false);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const handleSend = async () => {
//     // Check if the user is connected to another player
//     if (!isConnected) {
//       console.log('You are not connected to another player!');
//       return;
//     }

//     // Get the other player's connection
//     const peer = Peer.getInstance();
//     const connection = peer.connections[0];

//     // Send the letters, score, and time to the other player
//     connection.send(JSON.stringify({ letters, score, time }));

//     // Listen for incoming data from the other player
//     connection.on('data', (data) => {
//       const { otherScore, otherTime } = JSON.parse(data);
//       // Compare the scores and times to determine the winner
//       if (otherScore > score || (otherScore === score && otherTime < time)) {
//         console.log('You lost!');
//       } else {
//         console.log('You won!');
//       }
//     });
//   };

//   return (
//     <View>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//         <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Score: {score}</Text>
//         {!noTimer && <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Time: {time}</Text>}
//       </View>
//       <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//         {letters.map((letter, index) => (
//           <Text key={index} style={{ fontSize: 48, margin: 10 }}>
//             {letter}
//           </Text>
//         ))}
//       </View>
//       <Button title="Connect" onPress={handleConnect} disabled={peerID !== ''} />
//       <Button title="Disconnect" onPress={handleDisconnect} disabled={!isConnected} />
//       <Button title="Send" onPress={handleSend} disabled={!isConnected} />
//     </View>
//   );
// };

// export default MultiplayerPage;



// This implimentation uses a socket.io server

// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import { setLetters } from "../../utils";
// import NetInfo from '@react-native-community/netinfo';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import io from 'socket.io-client';

// const MultiplayerPage = ({ navigation, challenge, noTimer }) => {
//   const [letters, setLettersState] = useState(setLetters());
//   const [score, setScore] = useState(0);
//   const [time, setTime] = useState(0);
//   const [isOnline, setIsOnline] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [room, setRoom] = useState(null);

//   useEffect(() => {
//     // Get the letters, score, and time from AsyncStorage
//     const getData = async () => {
//       try {
//         const savedLetters = await AsyncStorage.getItem('letters');
//         const savedScore = await AsyncStorage.getItem('score');
//         const savedTime = await AsyncStorage.getItem('time');

//         if (savedLetters !== null) {
//           setLettersState(JSON.parse(savedLetters));
//         }

//         if (savedScore !== null) {
//           setScore(parseInt(savedScore));
//         }

//         if (savedTime !== null) {
//           setTime(parseInt(savedTime));
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     };

//     getData();

//     // Check if the user is online
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       setIsOnline(state.isConnected);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleConnect = async () => {
//     // Generate a unique room ID for this game
//     const newRoom = Math.random().toString(36).substring(7);

//     // Save the room ID to AsyncStorage
//     try {
//       await AsyncStorage.setItem('room', newRoom);
//       setRoom(newRoom);
//     } catch (e) {
//       console.log(e);
//     }

//     // Connect to the socket server and join the room
//     const newSocket = io('http://localhost:3000');
//     newSocket.on('connect', () => {
//       newSocket.emit('join', newRoom);
//       setSocket(newSocket);
//     });

//     // Listen for incoming data from the other player
//     newSocket.on('data', (data) => {
//       const { otherScore, otherTime } = JSON.parse(data);
//       // Compare the scores and times to determine the winner
//       if (otherScore > score || (otherScore === score && otherTime < time)) {
//         console.log('You lost!');
//       } else {
//         console.log('You won!');
//       }
//     });
//   };

//   const handleDisconnect = async () => {
//     // Disconnect from the socket server
//     socket.disconnect();

//     // Clear the saved data from AsyncStorage
//     try {
//       await AsyncStorage.removeItem('letters');
//       await AsyncStorage.removeItem('score');
//       await AsyncStorage.removeItem('time');
//       await AsyncStorage.removeItem('room');
//       setLettersState([]);
//       setScore(0);
//       setTime(0);
//       setRoom(null);
//       setSocket(null);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   handleSend = async () => {
//     // Check if the user is connected to another player
//     if (socket === null) {
//     console.log('You are not connected to another player!');
//     return;
//     }
    
//     // Check if the user has internet connection
//     if (!isOnline) {
//       console.log('You are offline!');
//       return;
//     }
    
//     const lettersToSend = letters.join('');
//     const data = {
//       letters: lettersToSend,
//       score: score,
//       time: time
//     };
    
//     try {
//       // Send the data to the other player
//       socket.emit('data', JSON.stringify(data));
    
//       // Clear the saved data from AsyncStorage
//       await AsyncStorage.removeItem('letters');
//       await AsyncStorage.removeItem('score');
//       await AsyncStorage.removeItem('time');
//       await AsyncStorage.removeItem('room');
//       setLettersState([]);
//       setScore(0);
//       setTime(0);
//       setRoom(null);
//       setSocket(null);
//     } catch (e) {
//       console.log(e);
//     }
//     };
    
//     return (
//     <View>
//     <Text>Multiplayer Game</Text>
//     <Text>Letters: {letters.join(', ')}</Text>
//     <Text>Score: {score}</Text>
//     <Text>Time: {time}</Text>
//     {room !== null ? (
//     <Text>You are in room {room}</Text>
//     ) : (
//     <Button title="Connect" onPress={handleConnect} />
//     )}
//     <Button title="Send" onPress={handleSend} />
//     <Button title="Disconnect" onPress={handleDisconnect} />
//     </View>
//     );
//     };
    
//     export default MultiplayerPage;
  
// works on ios createEGL14 error on android
// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import { setLetters } from "../../utils";
// import NetInfo from '@react-native-community/netinfo';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';

// const MultiplayerPage = ({ navigation, challenge, noTimer }) => {
//   const [letters, setLettersState] = useState(setLetters());
//   const [score, setScore] = useState(0);
//   const [time, setTime] = useState(0);
//   const [isOnline, setIsOnline] = useState(false);
//   const [peerConnection, setPeerConnection] = useState(null);
//   const [room, setRoom] = useState(null);

//   useEffect(() => {
//     // Get the letters, score, and time from AsyncStorage
//     const getData = async () => {
//       try {
//         const savedLetters = await AsyncStorage.getItem('letters');
//         const savedScore = await AsyncStorage.getItem('score');
//         const savedTime = await AsyncStorage.getItem('time');

//         if (savedLetters !== null) {
//           setLettersState(JSON.parse(savedLetters));
//         }

//         if (savedScore !== null) {
//           setScore(parseInt(savedScore));
//         }

//         if (savedTime !== null) {
//           setTime(parseInt(savedTime));
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     };

//     getData();

//     // Check if the user is online
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       setIsOnline(state.isConnected);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleConnect = async () => {
//     // Generate a unique room ID for this game
//     const newRoom = Math.random().toString(36).substring(7);

//     // Save the room ID to AsyncStorage
//     try {
//       await AsyncStorage.setItem('room', newRoom);
//       setRoom(newRoom);
//     } catch (e) {
//       console.log(e);
//     }

//     // Create a new peer connection object
//     const newPeerConnection = new RTCPeerConnection({
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
//         { urls: 'stun:global.stun.twilio.com:3478?transport=tcp' },
//       ]
//     });
//     setPeerConnection(newPeerConnection);

//     // Create an offer to start the WebRTC negotiation process
//     const offer = await newPeerConnection.createOffer();
//     await newPeerConnection.setLocalDescription(new RTCSessionDescription(offer));

//     // Send the offer to the other player
//     const data = { type: 'offer', sdp: offer.sdp };
//     await sendData(data);
//   };

//   const handleDisconnect = async () => {
//     // Close the peer connection
//     peerConnection.close();

//     // Clear the saved data from AsyncStorage
//     try {
//       await AsyncStorage.removeItem('letters');
//       await AsyncStorage.removeItem('score');
//       await AsyncStorage.removeItem('time');
//       await AsyncStorage.removeItem('room');
//       setLettersState([]);
//       setScore(0);
//       setTime(0);
//       setRoom(null);
//       setPeerConnection(null);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const handleSend = async () => {
//     // Check if the user has internet connection
//     if (!isOnline) {
//       console.log('You are offline!');
//       return;
//     }

//     // Check if the
  
//   // Get the letters, score, and time from state
//   const lettersToSend = letters.join('');
//   const scoreToSend = score.toString();
//   const timeToSend = time.toString();
  
//   // Send the data to the other player
//   const data = { type: 'data', letters: lettersToSend, score: scoreToSend, time: timeToSend };
//   await sendData(data);
//   };
  
//   const sendData = async (data) => {
//     // Get the peer connection object from state
//     const peerConnection = peerConnection;
  
//     // Check if the peer connection object exists
//     if (peerConnection) {
//       // Get the data channel
//       const dataChannel = peerConnection.createDataChannel('dataChannel');
  
//       // Set up an event listener for when the data channel is open
//       dataChannel.onopen = (event) => {
//         console.log('Data channel opened');
//         // Send the data through the data channel
//         dataChannel.send(JSON.stringify(data));
//       };
//     }
//   };
  
//   const goToGame = () => {
//     navigation.navigate('Game', { letters: letters, gameState: 'multi', challenge: challenge, noTimer: noTimer });
//   };

  
//   return (
//   <View>
//   <Text>Multiplayer Page</Text>
//   <Text>Challenge: {challenge}</Text>
//   <Text>Score: {score}</Text>
//   <Text>Time: {time}</Text>
//   <Text>Letters: {letters.join(', ')}</Text>
//   {!room ? (
//   <Button title="Connect" onPress={handleConnect} />
//   ) : (
//   <Button title="Disconnect" onPress={handleDisconnect} />
//   )}
//   <Button title="Send Data" onPress={handleSend} />
//   <Button title="Play" onPress={goToGame} />
//   </View>
//   );
//   };

//   export default MultiplayerPage; 


// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import { setLetters } from '../../utils';
// import NetInfo from '@react-native-community/netinfo';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Peer from 'peerjs';


// const MultiplayerPage = ({ navigation, challenge, noTimer }) => {
//   const [letters, setLettersState] = useState(setLetters());
//   const [score, setScore] = useState(0);
//   const [time, setTime] = useState(0);
//   const [isOnline, setIsOnline] = useState(false);
//   const [peer, setPeer] = useState(null);
//   const [conn, setConn] = useState(null);
//   const [peerId, setPeerId] = useState('');

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const savedLetters = await AsyncStorage.getItem('letters');
//         const savedScore = await AsyncStorage.getItem('score');
//         const savedTime = await AsyncStorage.getItem('time');

//         if (savedLetters !== null) {
//           setLettersState(JSON.parse(savedLetters));
//         }

//         if (savedScore !== null) {
//           setScore(parseInt(savedScore));
//         }

//         if (savedTime !== null) {
//           setTime(parseInt(savedTime));
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     };

//     getData();

//     const unsubscribe = NetInfo.addEventListener((state) => {
//       setIsOnline(state.isConnected);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleConnect = async () => {
//     const id = Math.random().toString(36).substring(7);
  
//     try {
//       await AsyncStorage.setItem('id', id);
//     } catch (e) {
//       console.log(e);
//     }
  
//     const peer = new Peer();
  
//     peer.on('open', (peerId) => {
//       console.log(`Peer connected with ID: ${peerId}`);
//       setPeerId(peerId);

//     });
  
//     const conn = peer.connect(otherPeerId); // replace otherPeerId with the ID of the other peer
  
//     conn.on('open', () => {
//       console.log('Data connection established');
//       setConn(conn);
//       conn.on('data', handleData);
//     });
  
//     setPeer(peer);
//   };
  

//   const handleDisconnect = async () => {
//     conn.close();
//     try {
//       await AsyncStorage.removeItem('letters');
//       await AsyncStorage.removeItem('score');
//       await AsyncStorage.removeItem('time');
//       await AsyncStorage.removeItem('room');
//       await AsyncStorage.removeItem('otherId');
//       setLettersState([]);
//       setScore(0);
//       setTime(0);
//       setPeer(null);
//       setConn(null);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const handleSend = async () => {
//     if (!isOnline) {
//       console.log('You are offline!');
//       return;
//     }
  
//     const lettersToSend = letters.join('');
//     const scoreToSend = score.toString();
//     const timeToSend = time.toString();
  
//     const data = {
//       letters: lettersToSend,
//       score: scoreToSend,
//       time: timeToSend,
//     };
  
//     if (conn) {
//       conn.send(data);
//     } else {
//       console.log('Connection not established!');
//     }
//   };
  

//   const handleData = (data) => {
//     setLettersState(data.letters.split(''));
//     setScore(parseInt(data.score));
//     setTime(parseInt(data.time));
//   };

//   const goToGame = () => {
//     navigation.navigate('Game', {
//       letters: letters,
//       gameState: 'multi',
//       challenge: challenge,
//       noTimer: noTimer,
//     });
//   };

//   return (
//     <View>
//       <Text>Id: {peerId}</Text>
//       <Text>Letters: {letters.join('')}</Text>
//       <Text>Score: {score}</Text>
//       <Text>Time: {time}</Text>
//       {!peer && <Button title="Connect" onPress={handleConnect} />}
//       {peer && (
//         <View>
//         <Button title="Disconnect" onPress={handleDisconnect} />
//         <Button title="Send" onPress={handleSend} />
//         <Button title="Start Game" onPress={goToGame} />
//         </View>
//         )}
//         </View>
//         );
//         };

// export default MultiplayerPage;

import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { setLetters } from '../../utils';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Peer from 'peerjs';
// import webrtc from 'react-native-webrtc';

const MultiplayerPage = ({ navigation, challenge, noTimer }) => {
  const [letters, setLettersState] = useState(setLetters());
  const [score, setScore] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [otherPeerId, setOtherPeerId] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const savedLetters = await AsyncStorage.getItem('letters');
        const savedScore = await AsyncStorage.getItem('score');
        const savedTime = await AsyncStorage.getItem('time');

        if (savedLetters !== null) {
          setLettersState(JSON.parse(savedLetters));
        }

        if (savedScore !== null) {
          setScore(parseInt(savedScore));
        }

        if (savedTime !== null) {
          setTime(parseInt(savedTime));
        }
      } catch (e) {
        console.log(e);
      }
    };

    getData();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleConnect = async () => {
    const id = Math.random().toString(36).substring(7);

    try {
      await AsyncStorage.setItem('id', id);
    } catch (e) {
      console.log(e);
    }

    const peer = new Peer(id, { host: 'localhost', port: 9000 });

    peer.on('open', (peerId) => {
      console.log(`Peer connected with ID: ${peerId}`);
      setPeerId(peerId);
    });

    setPeer(peer);
  };

  const handleFindPeer = async () => {
    if (!peer) {
      console.log('You are not connected to another player');
      return;
    }

    const otherPeer = new Peer({ host: 'localhost', port: 9000 });
    otherPeer.on('open', (otherPeerId) => {
      console.log(`Found other peer with ID: ${otherPeerId}`);
      setOtherPeerId(otherPeerId);
      const conn = peer.connect(otherPeerId);
      setConn(conn);
      conn.on('open', () => {
        console.log('Data connection established');
        conn.on('data', handleData);
      });
    });
  };

  const handleDisconnect = async () => {
    if (conn) {
      conn.close();
      setConn(null);
    }

    try {
      await AsyncStorage.multiRemove(['letters', 'score', 'time', 'room', 'otherId']);
      setLettersState([]);
      setScore(0);
      setPeer(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSend = async () => {
    if (!isOnline) {
      console.log('You are offline!');
      return;
    }

    if (!conn) {
      console.log('You are not connected to another player');
      return;
    }

    const dataToSend = { letters: letters.join(''), score: score.toString() };
    conn.send(dataToSend);
  };

  const handleData = (data) => {
    const receivedLetters = data.letters.split('');
  
    // Update own state with received letters
    setLettersState(receivedLetters);
  
    // Calculate score based on updated letters
    const newScore = receivedLetters.reduce((acc, letter) => {
      const letterScore = challenge.letterScores[letter];
      return acc + (letterScore ? letterScore : 0);
    }, 0);
  
    setScore(newScore);
  };

    const goToGame = () => {
    navigation.navigate('Game', {
      letters: letters,
      gameState: 'multi',
      challenge: challenge,
      noTimer: noTimer,
    });
  };
  
  return (
    <View>
      <Text>Multiplayer Page</Text>
      <Text>Letters: {letters.join(', ')}</Text>
      <Text>Score: {score}</Text>
      <Button title="Connect" onPress={handleConnect} />
      <Button title="Find Peer" onPress={handleFindPeer} />
      <Button title="Disconnect" onPress={handleDisconnect} />
      <Button title="Send" onPress={handleSend} />
      <Button title="Play" onPress={goToGame} />
    </View>
  );
};

export default MultiplayerPage;