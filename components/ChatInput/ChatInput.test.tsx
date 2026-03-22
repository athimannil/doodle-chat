function joinChat(username = 'TestUser') {
  const nameInput = screen.getByPlaceholderText(
    /enter your name to join/i
  ) as HTMLInputElement;
  fireEvent.change(nameInput, { target: { value: username } });
  const joinButton = screen.getByRole('button', { name: /join chat/i });
  fireEvent.click(joinButton);
}
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

import ChatInput from './ChatInput';

import { useSendMessage } from '@/hooks/useMessages';
import { UserProvider } from '@/context/userContext';

vi.mock('@/hooks/useMessages');

describe('ChatInput', () => {
  let mutateMock: Mock;
  beforeEach(() => {
    localStorage.clear();
    mutateMock = vi.fn();
    vi.mocked(useSendMessage).mockReturnValue({
      mutate: mutateMock,
      isError: false,
      isLoading: false,
    });
  });

  it('renders input and button', async () => {
    render(
      <UserProvider>
        <ChatInput />
      </UserProvider>
    );
    joinChat();
    const input = await screen.findByPlaceholderText(/type your message/i);
    expect(input).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('updates input value when typing', async () => {
    render(
      <UserProvider>
        <ChatInput />
      </UserProvider>
    );
    joinChat();
    const input = (await screen.findByPlaceholderText(
      /type your message/i
    )) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello world' } });
    expect(input.value).toBe('Hello world');
  });

  it('calls sendMessage with correct payload and clears input', async () => {
    render(
      <UserProvider>
        <ChatInput />
      </UserProvider>
    );
    joinChat();
    const input = (await screen.findByPlaceholderText(
      /type your message/i
    )) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    const options = mutateMock.mock.calls[0][1];
    options.onSettled();

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
