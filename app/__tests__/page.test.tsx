import { expect, test, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';

import Page from '@/app/page';
import AppProviders from '@/lib/providers';
import { UserProvider } from '@/context/userContext';

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

test('Page', () => {
  render(
    <AppProviders>
      <UserProvider>
        <Page />
      </UserProvider>
    </AppProviders>
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Doodle Chat'
  );
});
