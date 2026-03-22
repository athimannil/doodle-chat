import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import ChatBubble from './ChatBubble';

import type { Message } from '@/lib/types';

const baseMessage: Message = {
  _id: '1',
  message: 'Hello world',
  author: 'Muhammed',
  createdAt: '2023-01-01T00:00:00.000Z',
};

describe('ChatBubble', () => {
  it('renders author, message, and timestamp for others', () => {
    render(<ChatBubble {...baseMessage} />);
    expect(screen.getByText(baseMessage.author)).toBeInTheDocument();
    expect(screen.getByText(baseMessage.message)).toBeInTheDocument();
    expect(screen.getByText(baseMessage.createdAt)).toBeInTheDocument();
  });

  it('does not render author for self ("Me")', () => {
    render(<ChatBubble {...baseMessage} author="Me" />);
    expect(screen.queryByText('Me')).not.toBeInTheDocument();
    expect(screen.getByText(baseMessage.message)).toBeInTheDocument();
    expect(screen.getByText(baseMessage.createdAt)).toBeInTheDocument();
  });
});
