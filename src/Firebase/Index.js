import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getStorage, ref,uploadBytes,getDownloadURL } from "firebase/storage";
import dotenv from 'dotenv'


import {Firestore,collection, 
  getDocs,orderBy,
  where,CollectionReference,
  query,startAt,endAt,
  setDoc,updateDoc,doc,
 addDoc, increment,getDoc,onSnapshot,
deleteDoc,deleteField, and} from  'firebase/firestore'


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  grpc: true,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db =  getFirestore(app)
const auth = getAuth(app);

auth.setPersistence(browserSessionPersistence)

const storage = getStorage()

export {
    db,auth,collection,getDocs,Firestore,orderBy,where,CollectionReference,
    query,startAt,endAt,setDoc,updateDoc,doc,addDoc,increment,getDoc,onSnapshot,
    deleteDoc,createUserWithEmailAndPassword,signInWithEmailAndPassword,
    deleteField,and,storage,ref,uploadBytes,getDownloadURL
}

