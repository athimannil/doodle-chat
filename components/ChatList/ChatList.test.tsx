import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, within } from '@testing-library/react';

import ChatList from './ChatList';
import chats from './chats.json';

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

describe('ChatList', () => {
  it('renders all messages with correct author and text', () => {
    render(<ChatList />);
    const chatList = screen.getByRole('log', { name: /chat messages/i });
    const bubbles = within(chatList).getAllByRole('article');

    expect(bubbles.length).toBe(chats.length);

    chats.forEach((msg, idx) => {
      const bubble = bubbles[idx];
      if (msg.author !== 'Me') {
        expect(within(bubble).getByText(msg.author)).toBeInTheDocument();
      } else {
        expect(within(bubble).queryByText('Me')).toBeNull();
      }
      expect(within(bubble).getByText(msg.message)).toBeInTheDocument();
      expect(within(bubble).getByText(msg.createdAt)).toBeInTheDocument();
    });
  });
});
