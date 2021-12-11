import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import BottomTabNavigator from './BottomTabNavigator';
import { ColorSchemeName } from 'react-native';
import { LoginScreen } from '@infominds/react-native-license';
import NewPasswordCardScreen from '../screens/NewPasswordCard';
import useApi from '../apis/useApi';
import DemoMode from '../constants/DemoMode';

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
      initialRouteName="Root"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login">
        {props =>
          <LoginScreen {...props}
            //customLoginFunction={useApi.login}
            projectCode={'APP-RXEXP'}
            modulCode={'APP'}
            demoData={{ lic: DemoMode.DEMO_LICENSE_KEY, username: DemoMode.DEMO_USERNAME, password: DemoMode.DEMO_PASSWORD }}
            isOffline={false}
            getMandants={false}
            getUserInfo={false}
            iconSource={require('../assets/img/icon.png')} />
        }
      </Stack.Screen>

      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerLeft: undefined }} />
      <Stack.Screen name="NewPasswordCard" component={NewPasswordCardScreen} />
    </Stack.Navigator>
  );
}
