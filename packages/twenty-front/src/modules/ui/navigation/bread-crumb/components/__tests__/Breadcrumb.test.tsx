import { render, screen } from '@testing-library/react';

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
});
