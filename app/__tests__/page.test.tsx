import { expect, test, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';

import Page from '@/app/page';

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

test('Page', () => {
  render(<Page />);
  expect(
    screen.getByRole('heading', {
      level: 1,
    })
  ).toHaveTextContent('Doodle Chat Coding Challenge');
});
