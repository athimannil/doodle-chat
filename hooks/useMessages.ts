import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMessages, sendMessage } from '@/lib/api';
import { Message } from '@/lib/types';

const POLL_INTERVAL = parseInt(
  process.env.NEXT_PUBLIC_POLLING_INTERVAL || '20000',
  10
);

const messageKeys = {
  all: ['messages'] as const,
  poll: ['messages', 'poll'] as const,
};

const useMessages = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: messageKeys.all,
    queryFn: () => getMessages({}),
  });

  useQuery({
    queryKey: messageKeys.poll,
    queryFn: async () => {
      const cached = queryClient.getQueryData<Message[]>(messageKeys.all);
      if (!cached || cached.length === 0) return [];

      const latest = new Date(
        cached[cached.length - 1].createdAt
      ).toISOString();

      const newMessages = await getMessages({ after: latest });

      if (newMessages.length > 0) {
        queryClient.setQueryData<Message[]>(messageKeys.all, (old = []) => [
          ...old,
          ...newMessages,
        ]);
      }

      return newMessages;
    },
    refetchInterval: POLL_INTERVAL,
    enabled: !query.isLoading,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

const useSendMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ message, author }: { message: string; author: string }) =>
      sendMessage(message, author),
    onSuccess: (newMessage: Message) => {
      queryClient.setQueryData<Message[]>(messageKeys.all, (oldData) =>
        oldData ? [...oldData, newMessage] : [newMessage]
      );
    },
  });

  return {
    mutate: mutation.mutate,
    isError: mutation.isError,
    isLoading: mutation.isPending,
  };
};

export { useMessages, useSendMessage };
