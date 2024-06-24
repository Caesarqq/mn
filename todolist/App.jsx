import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TaskListScreen from './screens/TaskListScreen';
import CompletedTasksScreen from './screens/CompletedTasksScreen';
import { Platform } from 'react-native';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }),
          width: 240,
        },
        drawerInactiveTintColor: '#ffffff',
        drawerActiveTintColor: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
        drawerActiveBackgroundColor: '#ffffff',
      }}
    >
      <Drawer.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Список Задач' }} />
      <Drawer.Screen name="CompletedTasks" component={CompletedTasksScreen} options={{ title: 'Выполненные задачи' }} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <MyDrawer />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
