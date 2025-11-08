// src/app/auth/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/ui/components/LoginForm';
import RegisterForm from '@/ui/components/RegisterForm';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.push('/dashboard'); // Redirect to dashboard after successful auth
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {isLoginView ? (
          <LoginForm 
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setIsLoginView(false)}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setIsLoginView(true)}
          />
        )}
        
        <div className="text-center mt-4">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {isLoginView 
              ? "Don't have an account? Register here" 
              : "Already have an account? Login here"}
          </button>
        </div>
      </div>
    </div>
  );
}