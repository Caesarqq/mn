import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskListScreen from '../screens/TaskListScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('TaskListScreen', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
  });

  it('добавляет новую задачу', async () => {
    const { getByPlaceholderText, getByText } = render(<TaskListScreen />);

    const input = getByPlaceholderText('Введите задачу');
    fireEvent.changeText(input, 'Новая задача');
    fireEvent.press(getByText('plus'));

    await waitFor(() => {
      expect(getByText('Новая задача')).toBeTruthy();
    });
  });

  it('отмечает задачу как выполненную', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify([{ key: '1', value: 'Задача 1', completed: false }])
    );

    const { getByText, getByRole } = render(<TaskListScreen />);

    await waitFor(() => {
      expect(getByText('Задача 1')).toBeTruthy();
    });

    const completeButton = getByRole('button', { name: 'check' });
    fireEvent.press(completeButton);

    await waitFor(() => {
      expect(getByRole('button', { name: 'undo' })).toBeTruthy();
    });
  });

  it('удаляет задачу', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify([{ key: '1', value: 'Задача 1', completed: false }])
    );

    const { getByText, getByRole, queryByText } = render(<TaskListScreen />);

    await waitFor(() => {
      expect(getByText('Задача 1')).toBeTruthy();
    });

    const deleteButton = getByRole('button', { name: 'delete' });
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(queryByText('Задача 1')).toBeNull();
    });
  });
});
