'use client';
import { FormEvent, useState } from 'react';

import styles from './ChatInput.module.css';

import { useSendMessage } from '@/hooks/useMessages';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };
  const { mutate: sendMessage, isError, isLoading } = useSendMessage();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === '') return;

    sendMessage(
      { message, author: 'Me' },
      {
        onSettled: () => {
          setMessage('');
        },
      }
    );
  };

  return (
    <div className={styles.chatInput}>
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        aria-label="Send a message"
      >
        <label htmlFor="message-input" className={styles.srOnly}>
          Message
        </label>
        <input
          id="chat-input"
          type="text"
          className={styles.input}
          placeholder="Type your message..."
          value={message}
          onChange={handleChange}
          autoFocus
        />
        <button
          className={styles.button}
          type="submit"
          disabled={isLoading || !message.trim()}
          aria-label="Send message"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {isError && (
        <p className={styles.error} role="alert">
          Failed to send message. Please try again.
        </p>
      )}
    </div>
  );
};

export default ChatInput;
