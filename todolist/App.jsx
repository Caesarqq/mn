import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, Dialog, Portal, TextInput as PaperTextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  // Определяем состояния для текущей задачи, списка задач, редактируемой задачи и текста для редактирования
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState('');

  // Функция для загрузки задач из локального хранилища (AsyncStorage)
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks'); // Получаем сохраненные задачи
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks)); // Если задачи существуют, обновляем состояние задач
      }
    } catch (error) {
      console.error('Ошибка', error); // Обработка ошибок
    }
  };

  // Функция для сохранения задач в локальное хранилище (AsyncStorage)
  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks)); // Сохраняем текущий список задач
    } catch (error) {
      console.error('Ошибка', error); // Обработка ошибок
    }
  };

  // Хук для загрузки задач из хранилища при первом рендере компонента
  useEffect(() => {
    loadTasks();
  }, []);

  // Хук для автоматического сохранения задач в хранилище при каждом изменении списка задач
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Функция для добавления новой задачи в список
  const addTask = () => {
    if (task.length > 0) { // Проверка, что задача не пустая
      setTasks([...tasks, { key: Math.random().toString(), value: task }]); // Добавляем новую задачу в список
      setTask(''); // Очищаем поле ввода
    }
  };

  // Функция для удаления задачи из списка по ключу
  const deleteTask = (taskKey) => {
    setTasks(tasks.filter(task => task.key !== taskKey)); // Фильтруем задачи, исключая удаляемую
  };

  // Функция для начала редактирования задачи
  const startEditTask = (task) => {
    setEditTask(task); // Устанавливаем редактируемую задачу
    setEditText(task.value); // Устанавливаем текст для редактирования
  };

  // Функция для сохранения изменений в редактируемой задаче
  const saveEditTask = () => {
    setTasks(tasks.map(task => (task.key === editTask.key ? { ...task, value: editText } : task))); // Обновляем текст задачи
    setEditTask(null); // Сбрасываем редактируемую задачу
    setEditText(''); // Очищаем поле редактирования
  };

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.container}>
          <Text style={styles.header}>Список Задач</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Введите задачу"
              value={task}
              onChangeText={setTask} // Обновляем состояние при изменении текста
            />
            <Button title="Добавить" onPress={addTask} />
          </View>
          <FlatList
            data={tasks} // Данные для отображения в списке
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.itemText}>{item.value}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => startEditTask(item)}>
                    <Text style={styles.buttonText}>Редактировать</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(item.key)}>
                    <Text style={styles.buttonText}>Удалить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={item => item.key} // Уникальный ключ для каждого элемента списка
          />
          <Portal>
            <Dialog visible={editTask !== null} onDismiss={() => setEditTask(null)}>
              <Dialog.Title>Редактировать задачу</Dialog.Title>
              <Dialog.Content>
                <PaperTextInput
                  label="Задача"
                  value={editText}
                  onChangeText={setEditText} // Обновляем текст задачи при редактировании
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button title="Отмена" onPress={() => setEditTask(null)} />
                <Button title="Сохранить" onPress={saveEditTask} /> 
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  itemText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
