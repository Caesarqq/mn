import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, Dialog, Portal, TextInput as PaperTextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { launchImageLibrary } from 'react-native-image-picker';

const Drawer = createDrawerNavigator();

function TaskListScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState('');

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Ошибка', error);
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Ошибка', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = () => {
    if (task.length > 0) {
      setTasks([...tasks, { key: Math.random().toString(), value: task, completed: false, image: null }]);
      setTask('');
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
        <Button title="Добавить" onPress={addTask} />
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.itemText}>{item.value}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => selectImage(item.key)}>
                <Text style={styles.buttonText}>Загрузить изображение</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => completeTask(item.key)}>
                <Text style={styles.buttonText}>{item.completed ? 'Отменить' : 'Выполнить'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => startEditTask(item)}>
                <Text style={styles.buttonText}>Редактировать</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.key)}>
                <Text style={styles.buttonText}>Удалить</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.key}
      />
      <Portal>
        <Dialog visible={editTask !== null} onDismiss={() => setEditTask(null)}>
          <Dialog.Title>Редактировать задачу</Dialog.Title>
          <Dialog.Content>
            <PaperTextInput
              label="Задача"
              value={editText}
              onChangeText={setEditText}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button title="Отмена" onPress={() => setEditTask(null)} />
            <Button title="Сохранить" onPress={saveEditTask} />
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
      console.error('Ошибка', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Выполненные задачи</Text>
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
    <Drawer.Navigator>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  listItem: {
    padding: 15,
    backgroundColor: '#1e90ff',
    borderRadius: 6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  itemText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  buttonContainer: {
    flexDirection: 'column', // Вертикальное расположение кнопок
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10, // Отступ между кнопками
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 6,
  },
});
