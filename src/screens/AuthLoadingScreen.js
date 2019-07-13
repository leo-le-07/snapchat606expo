import React from 'react'
import { View, Text, ActivityIndicator, StatusBar } from 'react-native'

import firebaseSvc from '../FirebaseSvc'

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props)

    this.bootstrapAsync()
  }

  bootstrapAsync = async () => {
    firebaseSvc.getAuth().onIdTokenChanged(user => {
      this.props.navigation.navigate(user ? 'App' : 'Auth')
    })
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    )
  }
}

export default AuthLoadingScreen
