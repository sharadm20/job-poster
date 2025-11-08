// __tests__/ui/components/RegisterForm.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '@/ui/components/RegisterForm';
import { container } from '@/shared/container';
import { UserRegistrationData } from '@/entities/user';

// Mock the container's registerUseCase
jest.mock('@/shared/container', () => ({
  container: {
    registerUseCase: {
      execute: jest.fn(),
    },
  },
}));

describe('RegisterForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnSwitchToLogin = jest.fn();
  const mockRegistrationData: UserRegistrationData = {
    name: 'John Doe',
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <RegisterForm 
        onSuccess={mockOnSuccess} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\? login here/i)).toBeInTheDocument();
  });

  it('allows user to enter registration data', () => {
    render(
      <RegisterForm 
        onSuccess={mockOnSuccess} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(nameInput, { target: { value: mockRegistrationData.name } });
    fireEvent.change(emailInput, { target: { value: mockRegistrationData.email } });
    fireEvent.change(passwordInput, { target: { value: mockRegistrationData.password } });

    expect(nameInput).toHaveValue(mockRegistrationData.name);
    expect(emailInput).toHaveValue(mockRegistrationData.email);
    expect(passwordInput).toHaveValue(mockRegistrationData.password);
  });

  it('calls registerUseCase with registration data when submitted', async () => {
    const mockExecute = jest.fn().mockResolvedValue({ token: 'mock-token' });
    (container.registerUseCase.execute as jest.MockedFunction<any>).mockImplementation(mockExecute);

    render(
      <RegisterForm 
        onSuccess={mockOnSuccess} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: mockRegistrationData.name } });
    fireEvent.change(emailInput, { target: { value: mockRegistrationData.email } });
    fireEvent.change(passwordInput, { target: { value: mockRegistrationData.password } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledWith(mockRegistrationData);
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('shows error message when registration fails', async () => {
    const errorMessage = 'Registration failed';
    const mockExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
    (container.registerUseCase.execute as jest.MockedFunction<any>).mockImplementation(mockExecute);

    render(
      <RegisterForm 
        onSuccess={mockOnSuccess} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: mockRegistrationData.name } });
    fireEvent.change(emailInput, { target: { value: mockRegistrationData.email } });
    fireEvent.change(passwordInput, { target: { value: mockRegistrationData.password } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it('calls onSwitchToLogin when login button is clicked', () => {
    render(
      <RegisterForm 
        onSuccess={mockOnSuccess} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    const loginButton = screen.getByText(/already have an account\? login here/i);
    fireEvent.click(loginButton);

    expect(mockOnSwitchToLogin).toHaveBeenCalled();
  });
});