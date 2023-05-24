import React, { useState } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
 
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getFirestore, collection, orderBy, query, limit, serverTimestamp,addDoc } from 'firebase/firestore';
import { getAuth,GoogleAuthProvider,signInWithPopup,signOut } from 'firebase/auth';

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
          <SignOut/>
      </header>
      <br/>
      <section>
        { user ? <ChatRoom/> : <SignIn/>}
      </section>

    </div>
  );
}
//Signs you in...
function SignIn(){
  const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth,provider);
  }
    return (
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    )   
}

//Signs you out...
function SignOut() {
  return auth.currentUser && (
      <button onClick={()=>signOut(auth)} >Sign out</button>
  )
}

function ChatRoom(){
  //get message document
  const messagesRef = collection(firestore,'messages');
  //query messages
  const documentQuerry = query(messagesRef, orderBy('createdAt'), limit(25));
  //real life refreshing of results
  const [messages] =  useCollectionData(documentQuerry,{ifField: 'id'});
  const [formValue, setFormValue] = useState('');

  //Used for senting a message
  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;//get stuff from google auth
    //Send data to firebase
    await addDoc(messagesRef,{
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');//Clear input ;)

}


  return (<>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>

    <form onSubmit={sendMessage}>
       <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
       <button type='submit'>  🖋️</button>
    </form>

  </>)
}

function ChatMessage(props){
  
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';

  
  return (
    <div className={`message ${messageClass}`}> 
         <img src={photoURL}></img> 

      <p>{text}</p>
    </div>
  )

}


export default App;
