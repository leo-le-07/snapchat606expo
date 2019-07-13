import firebase from 'firebase'
import 'firebase/firestore'

class FirebaseSvc {
  database

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCzptQe1a-P-j0r749Af9Rg_4UYUpKjg2w",
        authDomain: "snapchat606-f3bcc.firebaseapp.com",
        databaseURL: "https://snapchat606-f3bcc.firebaseio.com",
        projectId: "snapchat606-f3bcc",
        storageBucket: "snapchat606-f3bcc.appspot.com",
        messagingSenderId: "314554280575",
        appId: "1:314554280575:web:f4f3c71498687521",
      })

      this.database = firebase.firestore()
    }
  }

  login = (user, successCallback, failedCallback) => {
    firebase.auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(successCallback, failedCallback)
  }

  getAuth = () => firebase.auth()

  signOut = () => firebase.auth().signOut()

  sendMessage = async (message) => {
    const userIDs = []

    try {
      const users = await this.database.collection('users').get()
      users.forEach(user => userIDs.push(user.id))

      for (i = 0; i < userIDs.length; i++) {
        const newMessageDoc = await this.database
          .collection('messageGroup')
          .doc(userIDs[i])
          .collection('messages')
          .add({
            ...message,
          })
      }
    } catch (error) {
      console.log('cannot send message', error);
      alert("Cannot send message")
    }
  }

  setLastSeenMessage = () => {
    const currentUser = firebase.auth().currentUser

    try {
      this.database
        .collection('lastSeenMessages')
        .doc(currentUser.uid)
        .set({
          timeAt: firebase.firestore.Timestamp.now()
        }, {
            merge: true
          })
    } catch (error) {
      console.log('setLastSeenMessage', error);
      alert("Cannot set last seen message")
    }
  }

  addCurrentUserToUserCollection = () => {
    try {
      const currentUser = firebase.auth().currentUser

      this.database.collection('users').doc(currentUser.uid).set({
        _id: currentUser.uid,
      }, { merge: true })

    } catch (error) {
      console.log('cannot add user', error);
      alert("Cannot add user")
    }
  }

  getMessagesQuery = (lastMessageDoc) => {
    const currentUser = firebase.auth().currentUser
    const query = this.database
      .collection('messageGroup')
      .doc(currentUser.uid)
      .collection('messages')
      .orderBy('createdAt', 'desc')

    if (lastMessageDoc) {
      return query.where('createdAt', '>=', lastMessageDoc.timeAt.toDate())
    }
    return query.limit(50)
  }

  getLastMessageDoc = async () => {
    const currentUser = firebase.auth().currentUser
    const lastDocSnapshot = await this.database
      .collection('lastSeenMessages')
      .doc(currentUser.uid)
      .get()

    if (!lastDocSnapshot.exists) return null
    return lastDocSnapshot.data()
  }

  getCurrentUser = () => (
    firebase.auth().currentUser
  )

  getUserName = () => {
    return this.getCurrentUser() ? this.getCurrentUser().displayName : null
  }

  getUserEmail = () => (
    this.getCurrentUser() ? this.getCurrentUser().email : null
  )
}

const firebaseSvc = new FirebaseSvc()
export default firebaseSvc
