import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
} from 'react-navigation'

import AuthLoadingScreen from './screens/AuthLoadingScreen'
import LoginScreen from './screens/LoginScreen'
import IntroductionScreen from './screens/IntroductionScreen'
import ChatScreen from './screens/ChatScreen'
import MeScreen from './screens/MeScreen'

const AuthNavigator = createStackNavigator({
  Login: LoginScreen,
})

const ChatNavigator = createStackNavigator({
  Introduction: { screen: IntroductionScreen },
  Chat: { screen: ChatScreen },
})

ChatNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.index > 0) tabBarVisible = false

  return {
    tabBarVisible,
  }
}

const AppNavigator = createBottomTabNavigator({
  'Trang chủ': ChatNavigator,
  'Cá nhân': MeScreen,
})

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppNavigator,
    Auth: AuthNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  }
))

export default AppContainer
