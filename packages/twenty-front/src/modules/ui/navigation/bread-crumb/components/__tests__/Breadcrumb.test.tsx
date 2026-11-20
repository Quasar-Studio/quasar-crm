import { render, screen } from '@testing-library/react';

import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';

jest.mock('@/ui/utilities/responsive/hooks/useIsMobile', () => ({
  useIsMobile: () => true,
}));

jest.mock('@/navigation/hooks/useIsSettingsPage', () => ({
  useIsSettingsPage: () => false,
}));

describe('Breadcrumb', () => {
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
});
