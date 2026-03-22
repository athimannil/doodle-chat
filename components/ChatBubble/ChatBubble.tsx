import styles from './ChatBubble.module.css';

import { Message } from '@/lib/types';

const ChatBubble = ({ message, author, createdAt }: Message) => {
  const isSelf = author === 'Me';
  return (
    <article
      className={`${styles.bubble} ${isSelf ? styles.bubbleSelf : ''}`}
      aria-label={`Message from ${author}`}
    >
      {!isSelf && <p className={styles.author}>{author}</p>}
      <p className={styles.message}>{message}</p>
      <time className={styles.timestamp}>{createdAt}</time>
    </article>
  );
};

export default ChatBubble;
