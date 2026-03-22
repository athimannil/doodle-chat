import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

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
    refetchOnReconnect: true,
  });

  const pollQuery = useQuery({
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
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (pollQuery.isError) {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
    }
  }, [pollQuery.isError, queryClient]);

  return useMemo(
    () => ({
      data: query.data,
      isLoading: query.isLoading,
      isError: query.isError,
    }),
    [query.data, query.isLoading, query.isError]
  );
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
