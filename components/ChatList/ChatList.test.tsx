import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';

import ChatList from './ChatList';

import { useMessages } from '@/hooks/useMessages';
import type { Message } from '@/lib/types';
import { UserProvider } from '@/context/userContext';
import { formatTimestamp } from '@/lib/utils';

vi.mock('@/hooks/useMessages');

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

const mockChats: Message[] = [
  {
    _id: '1',
    message: 'Hello',
    author: 'Muhammed',
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    _id: '2',
    message: 'Mate',
    author: 'Athimannil',
    createdAt: '2023-01-02T00:01:00.000Z',
  },
  {
    _id: '3',
    message: 'How are you?',
    author: 'Me',
    createdAt: '2023-01-02T00:02:00.000Z',
  },
  {
    _id: '4',
    message: 'I am good, thanks!',
    author: 'Muhammed',
    createdAt: '2023-01-02T00:03:00.000Z',
  },
];

describe('ChatList', () => {
  it('renders all messages and authors', () => {
    vi.mocked(useMessages).mockReturnValue({
      data: mockChats,
      isLoading: false,
      isError: false,
    });

    localStorage.setItem('doodle-chat-username', 'Me');
    render(
      <UserProvider>
        <ChatList />
      </UserProvider>
    );
    const chatList = screen.getByRole('log', { name: /chat messages/i });
    const bubbles = within(chatList).getAllByRole('article');
    expect(bubbles.length).toBe(mockChats.length);
    mockChats.forEach((msg, idx) => {
      const bubble = bubbles[idx];
      if (msg.author !== 'Me') {
        expect(within(bubble).getByText(msg.author)).toBeInTheDocument();
      } else {
        expect(within(bubble).queryByText('Me')).toBeNull();
      }
      expect(within(bubble).getByText(msg.message)).toBeInTheDocument();
      expect(
        within(bubble).getByText(formatTimestamp(msg.createdAt))
      ).toBeInTheDocument();
    });
  });

  it('renders loading state', () => {
    vi.mocked(useMessages).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(
      <UserProvider>
        <ChatList />
      </UserProvider>
    );
    expect(screen.getByText(/loading messages/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    vi.mocked(useMessages).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(
      <UserProvider>
        <ChatList />
      </UserProvider>
    );
    expect(screen.getByText(/failed to load messages/i)).toBeInTheDocument();
  });

  it('renders empty state', () => {
    vi.mocked(useMessages).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(
      <UserProvider>
        <ChatList />
      </UserProvider>
    );
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });
});
