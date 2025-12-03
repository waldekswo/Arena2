import { render, screen } from '@testing-library/react';
import App from './App';

test('renders pokedex heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /pokédex/i })).toBeInTheDocument();
});
