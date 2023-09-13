// Firebase 9
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const config = {
    apiKey: "AIzaSyBIrGCSQAOUDSbmctkGD5Gxb6qv1StCxeM",
    authDomain: "marvel-quiz-14d43.firebaseapp.com",
    projectId: "marvel-quiz-14d43",
    storageBucket: "marvel-quiz-14d43.appspot.com",
    messagingSenderId: "202209249392",
    appId: "1:202209249392:web:44df50599adde431200cb5"
};

const app = initializeApp(config);
export const auth = getAuth(app);

export const firestore = getFirestore();

export const user = uid => doc(firestore, `users/${uid}`);
