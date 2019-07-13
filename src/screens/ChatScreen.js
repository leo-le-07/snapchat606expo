import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

import firebaseSvc from '../FirebaseSvc'

class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: firebaseSvc.getUserName(),
  })

  constructor(props) {
    super(props)

    this.currentUser = firebaseSvc.getCurrentUser()

    this.state = {
      messages: [],
    }
  }

  componentDidMount() {
    this.listenForMessages()
  }

  componentWillUnmount() {
    this.unsubsribe()
    firebaseSvc.setLastSeenMessage()
  }

  listenForMessages = async () => {
    const lastMessageDoc = await firebaseSvc.getLastMessageDoc()

    this.unsubsribe = firebaseSvc.getMessagesQuery(lastMessageDoc).onSnapshot((snapshot) => {
      const newMessages = []

      snapshot.docChanges().forEach((change) => {
        const rawMessage = change.doc.data()
        const message = {
          ...rawMessage,
          createdAt: rawMessage.createdAt.toDate(),
        }
        newMessages.push(message)
      })

      this.setState((prevState) => ({
        messages: GiftedChat.append(prevState.messages, newMessages),
      }))
    })
  }

  sendMessage = (newMessages) => {
    const message = newMessages[0]
    firebaseSvc.sendMessage(message)
  }

  render() {
    return (
      <GiftedChat
        onSend={this.sendMessage}
        messages={this.state.messages}
        user={{
          _id: this.currentUser.uid,
          email: this.currentUser.email,
          name: this.currentUser.displayName,
         }}
      />
    )
  }
}

export default ChatScreen
