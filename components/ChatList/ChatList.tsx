'use client';
import { useEffect, useRef } from 'react';

import ChatBubble from '../ChatBubble/ChatBubble';

import styles from './ChatList.module.css';

import { useMessages } from '@/hooks/useMessages';
import { useUser } from '@/context/userContext';

const ChatList = () => {
  const { data: messages, isLoading, isError } = useMessages();
  const { username } = useUser();

  const bottomRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  const messageCount = messages?.length ?? 0;

  useEffect(() => {
    if (messageCount > 0 && messageCount !== prevCountRef.current) {
      bottomRef.current?.scrollIntoView({
        behavior: prevCountRef.current === 0 ? 'instant' : 'smooth',
      });
      prevCountRef.current = messageCount;
    }
  }, [messageCount]);

  if (isLoading) {
    return (
      <div
        className={styles.chatList}
        role="status"
        aria-label="Loading messages"
      >
        <p>Loading messages...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={styles.chatList}
        role="alert"
        aria-label="Error loading messages"
      >
        <p>Failed to load messages. Please try again later.</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className={styles.status} role="status" aria-label="No messages">
        <p> No messages yet. Be the first to say hello!</p>
      </div>
    );
  }

  return (
    <div
      className={styles.chatList}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {messages?.map((msg) => (
        <ChatBubble
          key={msg._id}
          isCurrentUser={msg.author === username}
          {...msg}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatList;
