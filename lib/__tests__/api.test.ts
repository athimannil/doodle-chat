import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { getMessages, sendMessage } from '../api';
import type { Message } from '../types';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
  global.fetch = mockFetch;
});

const mockMessages: Message[] = [
  {
    _id: '1',
    message: 'Hello',
    author: 'Muhammed',
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    _id: '2',
    message: 'Mate',
    author: 'Athimannil',
    createdAt: '2023-01-02T00:01:00.000Z',
  },
];

describe('API', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getMessages', () => {
    it('should fetch messages from API and return array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessages,
      });

      const result = await getMessages({});

      expect(result).toEqual(mockMessages);
      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];
      expect(url.toString()).toContain('/api/v1/messages');
      expect(options).toMatchObject({
        method: 'GET',
        headers: { Authorization: expect.stringContaining('Bearer ') },
        cache: 'no-store',
      });
    });

    it('should include query parameters when options provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await getMessages({ after: 'cursor123', limit: 10 });

      const [url] = mockFetch.mock.calls[0];
      const urlObj = new URL(url.toString());
      expect(urlObj.searchParams.get('after')).toBe('cursor123');
      expect(urlObj.searchParams.get('limit')).toBe('10');
    });

    it('should not include optional query parameters when not provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await getMessages({});

      const [url] = mockFetch.mock.calls[0];
      const urlObj = new URL(url.toString());
      expect(urlObj.searchParams.get('after')).toBeNull();
      expect(urlObj.searchParams.get('limit')).toBeNull();
    });

    it('should throw error on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
        json: async () => ({
          message: 'Invalid token',
          code: 'AUTH_ERROR',
        }),
      });

      await expect(getMessages({})).rejects.toThrow(
        'Invalid token (code: AUTH_ERROR)'
      );
    });

    it('should throw error with statusText when json parsing fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(getMessages({})).rejects.toThrow(
        'Internal Server Error (code: unknown)'
      );
    });

    it('should include auth token in headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await getMessages({});

      const [, options] = mockFetch.mock.calls[0];
      const headers = options?.headers;
      expect(headers.Authorization).toContain('Bearer ');
      expect(headers.Authorization).toContain('super-secret-doodle-token');
    });
  });

  describe('sendMessage', () => {
    it('should send message and return response', async () => {
      const mockResponse: Message = {
        _id: '123',
        message: 'Test message',
        author: 'TestUser',
        createdAt: '1234567890',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sendMessage('Test message', 'TestUser');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];
      expect(url.toString()).toContain('/api/v1/messages');
      expect(options).toMatchObject({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: expect.stringContaining('Bearer '),
        },
      });
    });

    it('should throw error when message is empty', async () => {
      await expect(sendMessage('', 'User')).rejects.toThrow(
        'Message cannot be empty'
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should throw error when author is empty', async () => {
      await expect(sendMessage('Test message', '')).rejects.toThrow(
        'Author cannot be empty'
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should throw error when both message and author are empty', async () => {
      await expect(sendMessage('', '')).rejects.toThrow(
        'Message cannot be empty'
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should throw error on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: async () => ({
          message: 'Invalid payload',
          code: 'VALIDATION_ERROR',
        }),
      });

      await expect(sendMessage('Test', 'User')).rejects.toThrow(
        'Invalid payload (code: VALIDATION_ERROR)'
      );
    });

    it('should include auth token in headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _id: '1',
          message: 'Test',
          author: 'User',
          createdAt: '123',
        }),
      });

      await sendMessage('Test', 'User');

      const [, options] = mockFetch.mock.calls[0];
      const headers = options?.headers;
      expect(headers.Authorization).toContain('Bearer ');
      expect(headers.Authorization).toContain('super-secret-doodle-token');
    });

    it('should send correct Content-Type header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _id: '1',
          message: 'Test',
          author: 'User',
          createdAt: '123',
        }),
      });

      await sendMessage('Test', 'User');

      const [, options] = mockFetch.mock.calls[0];
      const headers = options?.headers;
      expect(headers['Content-Type']).toBe('application/json');
    });
  });
});
