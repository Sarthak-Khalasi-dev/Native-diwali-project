import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupListScreen from '../screens/groups/GroupListScreen';
import GroupDetailScreen from '../screens/groups/GroupDetailScreen';

const Stack = createNativeStackNavigator();

export default function GroupNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GroupList" component={GroupListScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
    </Stack.Navigator>
  );
}
