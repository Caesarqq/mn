import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, Platform, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, Dialog, Portal, TextInput as PaperTextInput, IconButton } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

function TaskListScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchText, setSearchText] = useState('');

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Ошибка при загрузке задач', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show("Ошибка при загрузке задач", ToastAndroid.LONG);
      } else {
        Alert.alert("Ошибка", "Ошибка при загрузке задач");
      }
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Ошибка при сохранении задач', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show("Ошибка при сохранении задач", ToastAndroid.LONG);
      } else {
        Alert.alert("Ошибка", "Ошибка при сохранении задач");
      }
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      saveTasks(tasks);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [tasks]);

  const addTask = () => {
    if (task.length > 0) {
      const newTask = { key: Date.now().toString(), value: task, completed: false, image: null };
      setTasks([...tasks, newTask]);
      setTask('');
      if (Platform.OS === 'android') {
        ToastAndroid.show("Задача добавлена", ToastAndroid.SHORT);
      } else {
        Alert.alert("Задача добавлена", `Задача добавлена: ${newTask.value}`);
      }
    }
  };

  const deleteTask = (taskKey) => {
    setTasks(tasks.filter(task => task.key !== taskKey));
  };

  const completeTask = (taskKey) => {
    setTasks(tasks.map(task => (task.key === taskKey ? { ...task, completed: !task.completed } : task)));
  };

  const startEditTask = (task) => {
    setEditTask(task);
    setEditText(task.value);
  };

  const saveEditTask = () => {
    setTasks(tasks.map(task => (task.key === editTask.key ? { ...task, value: editText } : task)));
    setEditTask(null);
    setEditText('');
  };

  const selectImage = (taskKey) => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setTasks(tasks.map(task => (task.key === taskKey ? { ...task, image: uri } : task)));
      }
    });
  };

  const filteredTasks = tasks.filter(task => task.value.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Привет</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Введите задачу"
          value={task}
          onChangeText={setTask}
        />
        <IconButton
          icon={() => <MaterialCommunityIcons name="plus" size={28} />}
          onPress={addTask}
          color="#1e90ff"
          style={styles.addButton}
        />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Поиск задач"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.itemText}>{item.value}</Text>
            <View style={styles.buttonContainer}>
              <IconButton
                icon={() => <MaterialCommunityIcons name="image" size={28} />}
                onPress={() => selectImage(item.key)}
                color="#ffffff"
                style={styles.iconButton}
              />
              <IconButton
                icon={() => <MaterialCommunityIcons name={item.completed ? "undo" : "check"} size={28} />}
                onPress={() => completeTask(item.key)}
                color="#ffffff"
                style={styles.iconButton}
              />
              <IconButton
                icon={() => <MaterialCommunityIcons name="pencil" size={28} />}
                onPress={() => startEditTask(item)}
                color="#ffffff"
                style={styles.iconButton}
              />
              <IconButton
                icon={() => <MaterialCommunityIcons name="delete" size={28} />}
                onPress={() => deleteTask(item.key)}
                color="#ffffff"
                style={styles.iconButton}
              />
            </View>
          </View>
        )}
        keyExtractor={item => item.key}
      />
      <Portal>
        <Dialog visible={editTask !== null} onDismiss={() => setEditTask(null)}>
          <Dialog.Title style={styles.dialogTitle}>Редактировать задачу</Dialog.Title>
          <Dialog.Content>
            <PaperTextInput
              label="Задача"
              value={editText}
              onChangeText={setEditText}
              style={styles.dialogInput}
              theme={{ colors: { primary: '#1e90ff' } }}
            />
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <IconButton
              icon={() => <MaterialCommunityIcons name="cancel" size={28} />}
              onPress={() => setEditTask(null)}
              color="#1e90ff"
            />
            <IconButton
              icon={() => <MaterialCommunityIcons name="content-save" size={28} />}
              onPress={saveEditTask}
              color="#1e90ff"
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

function CompletedTasksScreen() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Ошибка при загрузке задач', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show("Ошибка при загрузке задач", ToastAndroid.LONG);
      } else {
        Alert.alert("Ошибка", "Ошибка при загрузке задач");
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Привет снова</Text>
      <FlatList
        data={tasks.filter(task => task.completed)}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.itemText}>{item.value}</Text>
          </View>
        )}
        keyExtractor={item => item.key}
      />
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.select({ ios: 50, android: 30 }), 
    paddingHorizontal: 20,
    backgroundColor: Platform.select({ ios: '#ffe4e1', android: '#f0f8ff' }), 
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomColor: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
    borderBottomWidth: 2,
    padding: 10,
    flex: 1,
    marginRight: 10,
    color: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
  },
  addButton: {
    backgroundColor: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5, 
  },
  listItem: {
    padding: 15,
    backgroundColor: Platform.select({ ios: '#ffb6c1', android: '#87cefa' }), 
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5, 
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  dialogTitle: {
    color: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dialogInput: {
    backgroundColor: '#f0f8ff',
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
