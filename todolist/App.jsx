import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

// Основной компонент приложения
export default function App() {
  // Использование хуков для управления состоянием задачи и списка задач
  const [task, setTask] = useState(''); // Состояние для хранения текста текущей задачи
  const [tasks, setTasks] = useState([]); // Состояние для хранения списка задач

  // Функция для добавления новой задачи в список
  const addTask = () => {
    if (task.length > 0) { // Проверка, что задача не пустая
      setTasks([...tasks, { key: Math.random().toString(), value: task }]); // Добавление новой задачи в список
      setTask(''); // Очистка текстового поля после добавления задачи
    }
  };

  // Функция для удаления задачи из списка
  const deleteTask = (taskKey) => {
    setTasks(tasks.filter(task => task.key !== taskKey)); // Удаление задачи по ключу
  };

  return (
    // Основной контейнер приложения
    <View style={styles.container}>
      <Text style={styles.header}>Список Задач</Text>
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
        data={tasks} // Передача данных для отображения
        renderItem={({ item }) => (
          // Обертка для задачи, позволяющая удалять задачу при нажатии
          <TouchableOpacity onPress={() => deleteTask(item.key)}>
            <View style={styles.listItem}>
              <Text>{item.value}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Стили для компонентов приложения
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
    backgroundColor: '#f9f9f9',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1, 
    marginTop: 5,
  },
});
