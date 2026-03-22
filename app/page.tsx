import ChatInput from '@/components/ChatInput';
import ChatList from '@/components/ChatList';

export default function Home() {
  return (
    <main className="app">
      <section className="chat-container">
        <h1>Doodle Chat Coding Challenge</h1>
        <ChatList />
        <ChatInput />
      </section>
    </main>
  );
}
