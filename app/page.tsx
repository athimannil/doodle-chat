import Header from '@/components/Header';
import ChatList from '@/components/ChatList';
import ChatInput from '@/components/ChatInput';

export default function Home() {
  return (
    <main className="app">
      <section className="chat-container">
        <Header />
        <ChatList />
        <ChatInput />
      </section>
    </main>
  );
}
