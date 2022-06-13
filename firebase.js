// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX7UmaWRr9Qgpm6vgjfqVtuCVx7R8Zwig",
  authDomain: "sixs-3eb53.firebaseapp.com",
  projectId: "sixs-3eb53",
  storageBucket: "sixs-3eb53.appspot.com",
  messagingSenderId: "45178394039",
  appId: "1:45178394039:web:d26a91f0f3db72864e8432"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
}else {
    app = firebase.app()
}

const auth = firebase.auth()

export { auth };
