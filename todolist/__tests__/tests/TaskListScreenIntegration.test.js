import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TaskListScreen from '@screens/TaskListScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(), // Мокаем метод getItem для имитации чтения данных
  setItem: jest.fn(), // Мокаем метод setItem для имитации записи данных
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(), // Мокаем метод launchImageLibrary для имитации выбора изображения
}));

// Подготовка данных для тестирования
const mockTasks = [
  { key: '1', value: 'Task 1', completed: false, image: null },
  { key: '2', value: 'Task 2', completed: true, image: null },
];

test('loads and displays tasks correctly', async () => {

  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockTasks));

  // Рендерим компонент TaskListScreen
  const { getByText } = render(<TaskListScreen />);

  await waitFor(() => {
    expect(getByText('Task 1')).toBeTruthy(); // Проверяем наличие первой задачи
    expect(getByText('Task 2')).toBeTruthy(); // Проверяем наличие второй задачи
  });
});

test('adds a new task and displays it in the list', async () => {

  AsyncStorage.getItem.mockResolvedValueOnce(null);

  // Рендерим компонент TaskListScreen
  const { getByPlaceholderText, getByText } = render(<TaskListScreen />);
  const input = getByPlaceholderText('Введите задачу'); // Находим текстовое поле для ввода задачи

  // Имитация ввода текста в текстовое поле
  fireEvent.changeText(input, 'New Task');
  fireEvent.press(getByText('Задача добавлена')); // Имитация нажатия кнопки добавления задачи
  
  await waitFor(() => {
    expect(getByText('New Task')).toBeTruthy(); // Проверяем наличие новой задачи в списке
  });
});

test('completes a task and updates its status', async () => {
  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockTasks));

  // Рендерим компонент TaskListScreen
  const { getByText } = render(<TaskListScreen />);
  await waitFor(() => getByText('Task 1'));

  fireEvent.press(getByText('check')); // Имитация нажатия кнопки завершения задачи
  
  await waitFor(() => {
    expect(getByText('undo')).toBeTruthy(); 
  });
});

test('deletes a task and removes it from the list', async () => {
  // Настраиваем мок так, чтобы он возвращал наши фиктивные данные
  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockTasks));

  // Рендерим компонент TaskListScreen
  const { getByText, queryByText } = render(<TaskListScreen />);
  await waitFor(() => getByText('Task 1')); 

  fireEvent.press(getByText('delete')); // Имитация нажатия кнопки удаления задачи
  
  await waitFor(() => {
    expect(queryByText('Task 1')).toBeNull(); // Проверяем, что задача больше не отображается в списке
  });
});
