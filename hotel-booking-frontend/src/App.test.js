import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Scegli l'hotel perfetto per il tuo soggiorno./i);
  expect(linkElement).toBeInTheDocument();
});
