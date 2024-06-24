import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TaskListScreen from '@screens/TaskListScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Мокаем методы AsyncStorage для имитации работы с асинхронным хранилищем
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(), // Мокаем метод getItem для чтения данных
  setItem: jest.fn(), // Мокаем метод setItem для записи данных
}));

// Мокаем метод launchImageLibrary из библиотеки react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(), // Мокаем метод launchImageLibrary для имитации выбора изображения
}));

// Подготовка фиктивных данных для тестирования
const mockTasks = [
  { key: '1', value: 'Task 1', completed: false, image: null },
  { key: '2', value: 'Task 2', completed: true, image: null },
];

// Тест загрузки и отображения задач
test('loads and displays tasks correctly', async () => {
  // Настраиваем мок, чтобы он возвращал подготовленные задачи
  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockTasks));

  // Рендерим компонент TaskListScreen
  const { getByText } = render(<TaskListScreen />);
  
  // Ждем, чтобы убедиться, что задачи отображаются правильно
  await waitFor(() => {
    expect(getByText('Task 1')).toBeTruthy(); // Проверяем наличие первой задачи
    expect(getByText('Task 2')).toBeTruthy(); // Проверяем наличие второй задачи
  });
});

// Тест добавления новой задачи
test('adds a new task and displays it in the list', async () => {
  // Настраиваем мок, чтобы он возвращал null, имитируя отсутствие задач
  AsyncStorage.getItem.mockResolvedValueOnce(null);

  // Рендерим компонент TaskListScreen
  const { getByPlaceholderText, getByText } = render(<TaskListScreen />);
  const input = getByPlaceholderText('Введите задачу'); // Находим текстовое поле для ввода задачи

  // Имитация ввода текста в текстовое поле
  fireEvent.changeText(input, 'New Task');
  fireEvent.press(getByText('Задача добавлена')); // Имитация нажатия кнопки добавления задачи
  
  // Ждем, чтобы убедиться, что новая задача отображается в списке
  await waitFor(() => {
    expect(getByText('New Task')).toBeTruthy(); // Проверяем наличие новой задачи в списке
  });
});

// Тест редактирования задачи
test('edits a task and updates its value', async () => {
  // Настраиваем мок, чтобы он возвращал подготовленные задачи
  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockTasks));

  // Рендерим компонент TaskListScreen
  const { getByText, getByDisplayValue } = render(<TaskListScreen />);
  await waitFor(() => getByText('Task 1')); // Ждем, чтобы убедиться, что задача загружена

  fireEvent.press(getByText('pencil')); // Имитация нажатия кнопки редактирования задачи
  fireEvent.changeText(getByDisplayValue('Task 1'), 'Edited Task'); // Имитация изменения текста задачи
  fireEvent.press(getByText('content-save')); // Имитация нажатия кнопки сохранения изменений
  
  // Ждем, чтобы убедиться, что текст задачи обновился
  await waitFor(() => {
    expect(getByText('Edited Task')).toBeTruthy(); // Проверяем наличие обновленного текста задачи
    expect(getByText('Task 1')).toBeFalsy(); // Проверяем, что старый текст задачи исчез
  });
});

// Тест завершения задачи
test('completes a task and updates its status', async () => {
  // Настраиваем мок, чтобы он возвращал подготовленные задачи
  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockTasks));

  // Рендерим компонент TaskListScreen
  const { getByText } = render(<TaskListScreen />);
  await waitFor(() => getByText('Task 1')); // Ждем, чтобы убедиться, что задача загружена

  fireEvent.press(getByText('check')); // Имитация нажатия кнопки завершения задачи
  
  // Ждем, чтобы убедиться, что статус задачи обновился
  await waitFor(() => {
    expect(getByText('undo')).toBeTruthy(); // Проверяем наличие кнопки "undo", что означает, что задача завершена
  });
});

// Тест удаления задачи
test('deletes a task and removes it from the list', async () => {
  // Настраиваем мок, чтобы он возвращал подготовленные задачи
  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockTasks));

  // Рендерим компонент TaskListScreen
  const { getByText, queryByText } = render(<TaskListScreen />);
  await waitFor(() => getByText('Task 1')); // Ждем, чтобы убедиться, что задача загружена

  fireEvent.press(getByText('delete')); // Имитация нажатия кнопки удаления задачи
  
  // Ждем, чтобы убедиться, что задача удалена из списка
  await waitFor(() => {
    expect(queryByText('Task 1')).toBeNull(); // Проверяем, что задача больше не отображается в списке
  });
});

// Тест фильтрации задач по тексту поиска
test('filters tasks based on search text', async () => {
  // Настраиваем мок, чтобы он возвращал подготовленные задачи
  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockTasks));

  // Рендерим компонент TaskListScreen
  const { getByPlaceholderText, getByText, queryByText } = render(<TaskListScreen />);
  await waitFor(() => getByText('Task 1')); // Ждем, чтобы убедиться, что задачи загружены

  const searchInput = getByPlaceholderText('Поиск задач'); // Находим текстовое поле для поиска задач
  fireEvent.changeText(searchInput, 'Task 2'); // Имитация ввода текста в поле поиска
  
  // Ждем, чтобы убедиться, что задачи фильтруются по тексту поиска
  await waitFor(() => {
    expect(getByText('Task 2')).toBeTruthy(); // Проверяем, что задача "Task 2" отображается
    expect(queryByText('Task 1')).toBeNull(); // Проверяем, что задача "Task 1" не отображается
  });
});
