'use client';
import { useEffect, useRef } from 'react';

import ChatBubble from '../ChatBubble/ChatBubble';

import styles from './ChatList.module.css';
import chats from './chats.json';

const ChatList = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    if (chats.length > 0 && chats.length !== prevCountRef.current) {
      bottomRef.current?.scrollIntoView({
        behavior: prevCountRef.current === 0 ? 'instant' : 'smooth',
      });
      prevCountRef.current = chats.length;
    }
  }, []);

  return (
    <div className={styles.chatList} role="log" aria-label="Chat messages">
      {chats.map((msg, idx) => (
        <div
          key={msg._id}
          ref={idx === chats.length - 1 ? bottomRef : undefined}
        >
          <ChatBubble {...msg} />
        </div>
      ))}
    </div>
  );
};

export default ChatList;
