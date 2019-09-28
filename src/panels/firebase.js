import * as firebase from 'firebase';

//const config = {
//    apiKey: "AIzaSyA09A1cOlMl6YC237rNbskE63KyqwaRjcA",
//    authDomain: "expensivevkchat.firebaseapp.com",
//    databaseURL: "https://expensivevkchat.firebaseio.com",
//    storageBucket: "gs://expensivevkchat.appspot.com"
//};
const config = {
    apiKey: "AIzaSyD-C4pgxhFSjlzf60rVDZ1_WzCw0IFzpOw",
    authDomain: "goalchallenge-8de36.firebaseapp.com",
    databaseURL: "https://goalchallenge-8de36.firebaseio.com",
    projectId: "goalchallenge-8de36",
    storageBucket: "goalchallenge-8de36.appspot.com",
    messagingSenderId: "824295567155",
    appId: "1:824295567155:web:4bdbb136ef918c9b0e9846",
    measurementId: "G-TXGZHKGNRB"
};

firebase.initializeApp(config);

const database = firebase.database();
const storage = firebase.storage();
const storage1 = firebase.storage;

export {
  database,
    storage,
    storage1
};
