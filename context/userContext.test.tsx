import React from 'react';
import { render, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserProvider, useUser } from './userContext';

const STORAGE_KEY = 'doodle-chat-username';

describe('UserProvider and useUser', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function TestComponent() {
    const { username, setUsername, isLoggedIn } = useUser();
    return (
      <div>
        <span data-testid="username">{username}</span>
        <span data-testid="isLoggedIn">{isLoggedIn ? 'yes' : 'no'}</span>
        <button onClick={() => setUsername('Alice')}>Set Alice</button>
      </div>
    );
  }

  it('provides default values and updates username', () => {
    const { getByTestId, getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    expect(getByTestId('username').textContent).toBe('');
    expect(getByTestId('isLoggedIn').textContent).toBe('no');

    act(() => {
      getByText('Set Alice').click();
    });

    expect(getByTestId('username').textContent).toBe('Alice');
    expect(getByTestId('isLoggedIn').textContent).toBe('yes');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('Alice');
  });

  it('reads username from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, 'Bob');
    const { getByTestId } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    expect(getByTestId('username').textContent).toBe('Bob');
    expect(getByTestId('isLoggedIn').textContent).toBe('yes');
  });

  it('throws if useUser is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Consumer() {
      useUser();
      return null;
    }
    expect(() => {
      render(<Consumer />);
    }).toThrow('useUser must be used within a UserProvider');
    spy.mockRestore();
  });
});
