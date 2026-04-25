import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from '../Layout';
import { BrowserRouter } from 'react-router-dom';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() }
  }),
}));

describe('Layout Component', () => {
  it('renders branding and navigation links', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );

    // Check for core brand text
    expect(screen.getByText('Mizan')).toBeDefined();
    expect(screen.getByText('Murabaha Engine')).toBeDefined();
    expect(screen.getByText('Takaful')).toBeDefined();
    expect(screen.getByText('Test Content')).toBeDefined();
  });
});
