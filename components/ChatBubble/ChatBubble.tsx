import styles from './ChatBubble.module.css';

import { formatTimestamp } from '@/lib/utils';
import { Message } from '@/lib/types';

interface ChatBubbleProps extends Message {
  isCurrentUser: boolean;
}

const ChatBubble = ({
  message,
  author,
  createdAt,
  isCurrentUser,
}: ChatBubbleProps) => {
  return (
    <article
      className={`${styles.bubble} ${isCurrentUser ? styles.bubbleSelf : ''}`}
      aria-label={`Message from ${author}`}
    >
      {!isCurrentUser && <p className={styles.author}>{author}</p>}
      <p className={styles.message}>{message}</p>
      <time className={styles.timestamp}>{formatTimestamp(createdAt)}</time>
    </article>
  );
};

export default ChatBubble;
