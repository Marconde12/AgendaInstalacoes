import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../src/screens/Login'; // ajuste o caminho conforme seu projeto

// Mock do useAuth
const mockSignIn = jest.fn(() => Promise.resolve());
jest.mock('../src/hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

// Mock Alert para evitar popups na execução do teste
import { Alert } from 'react-native';
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('Login Screen', () => {
  const mockNavigation = {
    setOptions: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('realiza login com sucesso e desabilita botão durante carregamento', async () => {
    const { getByPlaceholderText, getByText } = render(<Login navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Senha');
    const loginButton = getByText('Entrar');
    fireEvent.changeText(emailInput, 'usuario@teste.com');
    fireEvent.changeText(passwordInput, '123456');
    fireEvent.press(loginButton);
    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'usuario@teste.com',
      password: '123456',
    });

    // Botão deve estar desabilitado durante o carregamento
    expect(loginButton.props.disabled).toBe(true);

    // Aguarda a resolução do login para o botão voltar a habilitado
    await waitFor(() => {
      expect(loginButton.props.disabled).toBe(false);
    });
  });

  it('teste simples', () => {
    expect(1 + 1).toBe(2);
  });
});
