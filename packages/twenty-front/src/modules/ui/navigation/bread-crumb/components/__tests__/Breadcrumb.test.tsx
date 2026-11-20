import { render, screen } from '@testing-library/react';
import { i18n } from '@lingui/core';
import { MemoryRouter } from 'react-router-dom';

import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';
import { useIsSettingsPage } from '@/navigation/hooks/useIsSettingsPage';

jest.mock('@/ui/utilities/responsive/hooks/useIsMobile', () => ({
  useIsMobile: () => true,
}));

jest.mock('@/navigation/hooks/useIsSettingsPage', () => ({
  useIsSettingsPage: jest.fn(() => false),
}));

describe('Breadcrumb', () => {
  beforeEach(() => {
    jest.mocked(useIsSettingsPage).mockReturnValue(false);
  });

  it('renders a single breadcrumb on mobile', () => {
    render(<Breadcrumb links={[{ children: 'Current page' }]} />);

    expect(screen.getByText('Current page')).toBeInTheDocument();
  });

  it('shows the previous breadcrumb when multiple links exist on mobile', () => {
    render(
      <Breadcrumb
        links={[{ children: 'Previous page' }, { children: 'Current page' }]}
      />,
    );

    expect(screen.getByText('Previous page')).toBeInTheDocument();
  });

  it('keeps a single settings breadcrumb hidden on mobile', () => {
    jest.mocked(useIsSettingsPage).mockReturnValue(true);

    render(<Breadcrumb links={[{ children: 'Settings' }]} />);

    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('renders a navigable back link for multiple mobile breadcrumbs', () => {
    i18n.load('en', {});
    i18n.activate('en');

    render(
      <MemoryRouter>
        <Breadcrumb
          links={[
            { children: 'Previous page', href: '/previous' },
            { children: 'Current page' },
          ]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/previous');
  });
});
