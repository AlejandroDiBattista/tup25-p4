'use client';

import { useState } from 'react';
import Login from '../components/Login';
import Registro from '../components/Registro';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'registro'>('login');

  return (
    <div>
      {mode === 'login' ? (
        <Login onRegistroClick={() => setMode('registro')} />
      ) : (
        <Registro onLoginClick={() => setMode('login')} />
      )}
    </div>
  );
}
