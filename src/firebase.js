import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';

// const config = {
//   apiKey: process.env.REACT_APP_FIRE_BASE_KEY,
//   authDomain: process.env.REACT_APP_FIRE_BASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIRE_BASE_DB_URL,
//   projectId: process.env.REACT_APP_FIRE_BASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIRE_BASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIRE_BASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIRE_BASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIRE_BASE_MEASURMENT_ID,
// };
const config = {
    apiKey: "AIzaSyC5NOMhO8GCjF5v5HikigBQQ88cB7KDXQI",
    authDomain: "scribe-portal-nss.firebaseapp.com",
    projectId: "scribe-portal-nss",
    storageBucket: "scribe-portal-nss.appspot.com",
    messagingSenderId: "380046350969",
    appId: "1:380046350969:web:20c0098e2ca972762412a8",
    measurementId: "G-QL9YXM3SMT"
};
  

firebase.initializeApp(config);
firebase.database();
firebase.storage();

export default firebase;
