import * as React from 'react';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import CalendarScreen from '../screens/CalendarScreen';
import UserScreen from '../screens/UserScreen';
// import SettingScreen from '../screens/SettingScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Calendar';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: '밥 달력',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-calendar" />,
        }}
      />
      <BottomTab.Screen
        name="User"
        component={UserScreen}
        options={{
          title: '대상자',
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name={'user'}
              size={30}
              style={{ marginBottom: -3 }}
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
          )
        }}
      />
      {/* <BottomTab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: '세팅',
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name={'setting'}
              size={30}
              style={{ marginBottom: -3 }}
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
          )
        }}
      /> */}
      {/* <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Get Started',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
        }}
      />
      <BottomTab.Screen
        name="Links"
        component={LinksScreen}
        options={{
          title: 'Resources',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      /> */}
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'How to get started';
    case 'Links':
      return 'Links to learn more';
  }
}
