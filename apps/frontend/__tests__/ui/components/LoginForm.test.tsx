// __tests__/ui/components/LoginForm.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/ui/components/LoginForm';
import { container } from '@/shared/container';
import { UserCredentials } from '@/entities/user';

// Mock the container's loginUseCase
jest.mock('@/shared/container', () => ({
  container: {
    loginUseCase: {
      execute: jest.fn(),
    },
  },
}));

describe('LoginForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnSwitchToRegister = jest.fn();
  const mockCredentials: UserCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\? register here/i)).toBeInTheDocument();
  });

  it('allows user to enter credentials', () => {
    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: mockCredentials.email } });
    fireEvent.change(passwordInput, { target: { value: mockCredentials.password } });

    expect(emailInput).toHaveValue(mockCredentials.email);
    expect(passwordInput).toHaveValue(mockCredentials.password);
  });

  it('calls loginUseCase with credentials when submitted', async () => {
    const mockExecute = jest.fn().mockResolvedValue({ token: 'mock-token' });
    (container.loginUseCase.execute as jest.MockedFunction<any>).mockImplementation(mockExecute);

    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: mockCredentials.email } });
    fireEvent.change(passwordInput, { target: { value: mockCredentials.password } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledWith(mockCredentials);
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('shows error message when login fails', async () => {
    const errorMessage = 'Invalid credentials';
    const mockExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
    (container.loginUseCase.execute as jest.MockedFunction<any>).mockImplementation(mockExecute);

    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: mockCredentials.email } });
    fireEvent.change(passwordInput, { target: { value: mockCredentials.password } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it('calls onSwitchToRegister when register button is clicked', () => {
    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    const registerButton = screen.getByText(/don't have an account\? register here/i);
    fireEvent.click(registerButton);

    expect(mockOnSwitchToRegister).toHaveBeenCalled();
  });
});