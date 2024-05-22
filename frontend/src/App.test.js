import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login form', () => {
  render(<App />);
  const loginButton = screen.getByText(/로그인/i);
  expect(loginButton).toBeInTheDocument();
});
