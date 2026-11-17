import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import ReaderScreen from '../screens/ReaderScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import AddBookScreen from '../screens/AddBookScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="Reader" component={ReaderScreen}
          options={{ headerShown: true, title: 'Читалка' }} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen}
          options={{ headerShown: true, title: 'Книга' }} />
        <Stack.Screen name="AddBook" component={AddBookScreen}
          options={{ headerShown: true, title: 'Добавить учебник' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
