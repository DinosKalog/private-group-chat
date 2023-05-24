import React from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
 
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getFirestore, collection, orderBy, query, limit} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const app = firebase.initializeApp({
  apiKey: "AIzaSyC80Zmkku6WWVvg_F7OfYl4YqdDo062qPI",
  authDomain: "my-first-firebase-projec-444a7.firebaseapp.com",
  projectId: "my-first-firebase-projec-444a7",
  storageBucket: "my-first-firebase-projec-444a7.appspot.com",
  messagingSenderId: "510595224956",
  appId: "1:510595224956:web:2ab4ea30378d00b0d5c0f9",
  measurementId: "G-GNG5GS1LQL"
})

const auth = getAuth(app);
const firestore = getFirestore(app);

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
       
      </header>
      <section>
        { user ? <ChatRoom/> : <SignIn/>}
      </section>

    </div>
  );
}

function SignIn(){
  const signInWithGoogle =() =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
    return (
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    )   
}

function SignOut() {
  return auth.currentUser && (
      <button onClick={()=> auth.SignOut()} >Sign out</button>
  )
}

function ChatRoom(){

  const messagesRef = collection(firestore,'messages');
  const documentQuerry = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(documentQuerry,{ifField: 'id'});

  return (
      <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      </main>    
      </>)
}

function ChatMessage(props){
  const {text, uid} = props.message;
  
  return (
     <p>{text}</p>
  )

}


export default App;
