import { initializeApp }
from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {

  apiKey:
    "AIzaSyCNK6NPYFbazsJVWasch1vM3zsDyb8cnmY",

  authDomain:
    "plantai-36cf8.firebaseapp.com",

  projectId:
    "plantai-36cf8",

  storageBucket:
    "plantai-36cf8.firebasestorage.app",

  messagingSenderId:
    "591521359638",

  appId:
    "1:591521359638:web:4f2bcbb739a33750e55237"
};

const app =
  initializeApp(
    firebaseConfig
  );

export const auth =
  getAuth(app);

export const provider =
  new GoogleAuthProvider();

provider.setCustomParameters({

  prompt:
    "select_account",
});