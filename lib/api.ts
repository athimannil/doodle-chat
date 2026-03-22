import { Message } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_TOKEN =
  process.env.NEXT_PUBLIC_API_TOKEN || 'super-secret-doodle-token';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    let errorCode: string | undefined;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      errorCode = errorData.code;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(`${errorMessage} (code: ${errorCode || 'unknown'})`);
  }

  return response.json() as Promise<T>;
};

const getMessages = async (options?: {
  after?: string;
  before?: string;
  limit?: number;
}): Promise<Message[]> => {
  const url = new URL(`${API_URL}/api/v1/messages`);

  if (options?.after) {
    url.searchParams.append('after', options.after);
  }

  if (options?.before) {
    url.searchParams.append('before', options.before);
  }

  if (options?.limit) {
    url.searchParams.append('limit', options.limit.toString());
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    cache: 'no-store',
  });

  const data = await handleResponse<Message[]>(response);

  return data;
};

const sendMessage = async (
  message: string,
  author: string
): Promise<Message> => {
  const payload = { message, author };

  if (!payload.message) {
    throw new Error('Message cannot be empty');
  }

  if (!payload.author) {
    throw new Error('Author cannot be empty');
  }

  const response = await fetch(`${API_URL}/api/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<Message>(response);

  return data;
};

export { getMessages, sendMessage };
