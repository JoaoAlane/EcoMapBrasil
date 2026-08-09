import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyByMKnvr7M6IomiBmDVASyRpnlVJ87uDoc",
  authDomain: "ecomapbrasil-17756.firebaseapp.com",
  projectId: "ecomapbrasil-17756",
  storageBucket: "ecomapbrasil-17756.firebasestorage.app",
  messagingSenderId: "43474149785",
  appId: "1:43474149785:web:2d3572d97a8f54c2d7f308"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
