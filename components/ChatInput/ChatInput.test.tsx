import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

import ChatInput from './ChatInput';

import { useSendMessage } from '@/hooks/useMessages';

vi.mock('@/hooks/useMessages');

describe('ChatInput', () => {
  let mutateMock: Mock;
  beforeEach(() => {
    mutateMock = vi.fn();
    vi.mocked(useSendMessage).mockReturnValue({
      mutate: mutateMock,
      isError: false,
      isLoading: false,
    });
  });

  it('renders input and button', () => {
    render(<ChatInput />);
    expect(
      screen.getByPlaceholderText(/type your message/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<ChatInput />);
    const input = screen.getByPlaceholderText(
      /type your message/i
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello world' } });
    expect(input.value).toBe('Hello world');
  });

  it('calls sendMessage with correct payload and clears input', async () => {
    render(<ChatInput />);
    const input = screen.getByPlaceholderText(
      /type your message/i
    ) as HTMLInputElement;
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
