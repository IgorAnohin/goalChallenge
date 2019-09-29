import * as firebase from 'firebase';

//const config = {
//    apiKey: "AIzaSyA09A1cOlMl6YC237rNbskE63KyqwaRjcA",
//    authDomain: "expensivevkchat.firebaseapp.com",
//    databaseURL: "https://expensivevkchat.firebaseio.com",
//    storageBucket: "gs://expensivevkchat.appspot.com"
//};
const config = {
    apiKey: "AIzaSyDCcGDb15HYfj6xrg85ceSfIK7q0USPAJU",
    authDomain: "thelats-ef16e.firebaseapp.com",
    databaseURL: "https://thelats-ef16e.firebaseio.com",
    projectId: "thelats-ef16e",
    storageBucket: "thelats-ef16e.appspot.com",
    messagingSenderId: "740007976530",
    appId: "1:740007976530:web:612368a87592b86e86898b",
    measurementId: "G-5E3ZXXEHE8"
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
