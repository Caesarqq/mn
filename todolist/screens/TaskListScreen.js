import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, FlatList, Platform, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog, Portal, TextInput as PaperTextInput, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TaskItem from '../components/TaskItem';
import { styles } from '../styles/styles';
import { launchImageLibrary } from 'react-native-image-picker';

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
      <Text style={styles.header}>Привет, юзер!</Text>
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
          <TaskItem 
            item={item}
            completeTask={completeTask}
            startEditTask={startEditTask}
            deleteTask={deleteTask}
            selectImage={selectImage} 
          />
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

export default TaskListScreen;
