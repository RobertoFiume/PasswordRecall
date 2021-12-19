import Icon from 'react-native-vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import TabHomeScreen from '../screens/TabHomeScreen';
import { Layout, ThemeContext } from '@infominds/react-native-components';
import { Colors } from '../constants/Colors';

const BottomTab = createBottomTabNavigator();
export default function BottomTabNavigator(props: { navigation: any }) {

  const colorScheme = React.useContext(ThemeContext);
  const theme = Colors[colorScheme];

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: Colors.tint,
        inactiveTintColor: theme.text,
        showLabel: true
      }}>

      <BottomTab.Screen
        name='Home'
        component={TabHomeNavigator}
        options={{
          title: '',
          tabBarIcon: ({ color }: any) => <TabBarIcon name="home" color={color} />
        }}
      />

      <BottomTab.Screen
        name='Settings'
        component={TabAddNavigator}
        options={{
          title: '',
          tabBarIcon: ({ color }: any) => <TabBarIcon name="plus-circle" color={color} />
        }}
        listeners={() => ({
          tabPress: event => {
            props.navigation.navigate('NewPasswordCard');
            event.preventDefault();
          }
        })}
      />

    </ BottomTab.Navigator>
  );
}

const TabBarIcon = (props: { name: string; color: string, iconStyle?: any }) => (
  <Icon
    size={35}
    style={[Layout.isSmallDevice ? { marginBottom: -13 } : { marginBottom: 0, marginLeft: 5, marginRight: -15 }, props.iconStyle]}
    {...props} />
)

const TabHomeStack = createStackNavigator();
function TabHomeNavigator() {
  return (
    <TabHomeStack.Navigator screenOptions={{ headerShown: false }}>
      <TabHomeStack.Screen
        name="TabHomeScreen"
        component={TabHomeScreen}
      />
    </TabHomeStack.Navigator >
  );
}

function TabAddNavigator() { return null }

const TabArchiveStack = createStackNavigator();
function TabArchiveNavigator() {
  return (
    <TabArchiveStack.Navigator screenOptions={{ headerShown: false }}>
      <TabArchiveStack.Screen
        name="TabArchiveScreen"
        component={TabArchiveScreen}
      />
    </TabArchiveStack.Navigator>
  );
}