import { renderHook, act, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useMessages } from './useMessages';

import * as api from '@/lib/api';

describe('useMessages', () => {
  let queryClient: QueryClient;
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockMessages = [
    {
      _id: '1',
      message: 'Hello',
      author: 'A',
      createdAt: '2023-01-01T00:00:00.000Z',
    },
    {
      _id: '2',
      message: 'World',
      author: 'B',
      createdAt: '2023-01-01T00:01:00.000Z',
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    // Mock API: initial fetch returns all messages, polling returns empty (no new messages)
    vi.spyOn(api, 'getMessages').mockImplementation(
      (options: { after?: string }) => {
        if (options.after) {
          return Promise.resolve([]); // Polling query returns no new messages
        }
        return Promise.resolve(mockMessages); // Initial query returns all messages
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    queryClient.clear();
  });

  it('fetches and returns messages', async () => {
    const { result } = renderHook(() => useMessages(), { wrapper });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual(mockMessages);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('handles error state', async () => {
    vi.spyOn(api, 'getMessages').mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useMessages(), { wrapper });
    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
    });
  });

  it('refetches on reconnect', async () => {
    const { result, rerender } = renderHook(() => useMessages(), {
      wrapper,
    });
    await waitFor(() => expect(result.current.data).toBeDefined());
    act(() => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    });
    rerender();
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(api.getMessages).toHaveBeenCalled();
  });
});
