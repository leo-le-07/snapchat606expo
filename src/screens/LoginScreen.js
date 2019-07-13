import React, { useState } from 'react'
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  AsyncStorage,
} from 'react-native'

import firebaseSvc from '../FirebaseSvc'
import { OFFSET } from '../utils/constants'

const LoginScreen = (props) => {
  const [email, setEmail] = useState('leo@gmail.com')
  const [password, setPassword] = useState('llllll')

  const onPressLogin = () => {
    const user = {
      email,
      password
    }
    firebaseSvc.login(user, loginSuccess, loginFailed)
  }

  const loginSuccess = async () => {
    const currentUser = firebaseSvc.getCurrentUser()

    await firebaseSvc.addCurrentUserToUserCollection()

    props.navigation.navigate('App')
  }

  const loginFailed = () => {
    alert('Login failure, please try again')
  }

  return (
    <View>
      <Text style={styles.title}>Email</Text>
      <TextInput
        value={email}
        style={styles.input}
        onChangeText={value => setEmail(value)}
      />
      <Text style={styles.title}>Mật khẩu</Text>
      <TextInput
        value={password}
        style={styles.input}
        onChangeText={value => setPassword(value)}
        secureTextEntry
      />
      <View style={styles.loginButton}>
        <Button
          title="Đăng nhập"
          onPress={onPressLogin}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    height: OFFSET * 2,
    marginTop: OFFSET/3,
    marginHorizontal: OFFSET,
    paddingHorizontal: OFFSET - 10,
    borderColor: '#111111',
    borderWidth: 1,
  },
  title: {
    marginTop: OFFSET,
    marginLeft: OFFSET,
    fontSize: OFFSET - 2,
  },
  loginButton: {
    marginTop: OFFSET,
  },
})

export default LoginScreen
