'use client';

import styles from './Header.module.css';

import { useUser } from '@/context/userContext';

const Header = () => {
  const { username, isLoggedIn } = useUser();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Doodle Chat</h1>
      {isLoggedIn && <span className={styles.username}>{username}</span>}
    </header>
  );
};

export default Header;
