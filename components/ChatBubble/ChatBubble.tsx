import { memo } from 'react';

import styles from './ChatBubble.module.css';

import { formatTimestamp, decodeHtml } from '@/lib/utils';
import { Message } from '@/lib/types';

interface ChatBubbleProps extends Message {
  isCurrentUser: boolean;
}

const ChatBubble = memo(function ChatBubble({
  message,
  author,
  createdAt,
  isCurrentUser,
}: ChatBubbleProps) {
  return (
    <article
      className={`${styles.bubble} ${isCurrentUser ? styles.bubbleSelf : ''}`}
      aria-label={`Message from ${author}`}
    >
      {!isCurrentUser && <p className={styles.author}>{author}</p>}
      <p className={styles.message}>{decodeHtml(message)}</p>
      <time className={styles.timestamp} dateTime={createdAt}>
        {formatTimestamp(createdAt)}
      </time>
    </article>
  );
});

export default ChatBubble;
