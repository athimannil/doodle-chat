'use client';
import { FormEvent, useState, useCallback } from 'react';

import styles from './ChatInput.module.css';

import { useSendMessage } from '@/hooks/useMessages';
import { useUser } from '@/context/userContext';

const NameInput = () => {
  const [name, setName] = useState('');
  const { setUsername } = useUser();

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = name.trim();
      if (!trimmed) return;
      setUsername(trimmed);
    },
    [name, setUsername]
  );

  return (
    <div className={styles.chatInput}>
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        aria-label="Enter your name to join the chat"
      >
        <label htmlFor="name-input" className={styles.srOnly}>
          Your name
        </label>
        <input
          id="name-input"
          className={styles.input}
          type="text"
          placeholder="Enter your name to join..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          autoFocus
        />
        <button
          className={styles.button}
          type="submit"
          disabled={!name.trim()}
          aria-label="Join chat"
        >
          Join
        </button>
      </form>
    </div>
  );
};

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { username } = useUser();
  const { mutate: sendMessage, isError, isLoading } = useSendMessage();
  const handleChange = useCallback((e: FormEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (message.trim() === '') return;
      sendMessage(
        { message, author: username },
        { onSettled: () => setMessage('') }
      );
    },
    [message, sendMessage, username]
  );

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

const ChatInput = () => {
  const { username } = useUser();

  return username ? <MessageInput /> : <NameInput />;
};

export default ChatInput;
