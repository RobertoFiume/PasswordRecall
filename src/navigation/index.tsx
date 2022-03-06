import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import BottomTabNavigator from './BottomTabNavigator';
import { ColorSchemeName } from 'react-native';
import NewPasswordCardScreen from '../screens/NewPasswordCard';

//import { LoginScreen } from '@infominds/react-native-license';
import LoginView from '../screens/Login/LoginView';

export default function Navigation(props: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer theme={props.colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();
function RootNavigator() {
  return (
    <Stack.Navigator
     // initialRouteName="Root"
     initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login">
        {props =>
          <LoginView {...props}
            //customLoginFunction={useApi.login}
           
            getUserInfo={false}
            iconSource={require('../assets/img/icon.png')} />
        }
      </Stack.Screen>

      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerLeft: undefined }} />
      <Stack.Screen name="NewPasswordCard" component={NewPasswordCardScreen} />
    </Stack.Navigator>
  );
}
