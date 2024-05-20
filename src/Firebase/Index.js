import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";


import {Firestore,collection, 
  getDocs,orderBy,
  where,CollectionReference,
  query,startAt,endAt,
  setDoc,updateDoc,doc,
 addDoc, increment,getDoc,onSnapshot,
deleteDoc,deleteField} from  'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyAACnnlYY-Lb0SFdkgDbe8DveHhoM0Lu2c",
  authDomain: "fir-newtech.firebaseapp.com",
  databaseURL: "https://fir-newtech-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-newtech",
  grpc: true,
  storageBucket: "fir-newtech.appspot.com",
  messagingSenderId: "646664658925",
  appId: "1:646664658925:web:3cc3a1377ab76d7100d1e4",
  measurementId: "G-DH8VH2X17Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db =  getFirestore(app)
const auth = getAuth(app);
export {
    db,auth,collection,getDocs,Firestore,orderBy,where,CollectionReference,
    query,startAt,endAt,setDoc,updateDoc,doc,addDoc,increment,getDoc,onSnapshot,
    deleteDoc,createUserWithEmailAndPassword,signInWithEmailAndPassword,
    deleteField
}

