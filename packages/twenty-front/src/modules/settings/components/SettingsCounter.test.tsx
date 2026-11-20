import { fireEvent, render, screen } from '@testing-library/react';
import { SettingsCounter } from './SettingsCounter';

jest.mock('@/ui/input/components/SettingsTextInput', () => ({
  SettingsTextInput: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <input
      aria-label="counter"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));
jest.mock('twenty-ui/input', () => ({ IconButton: () => null }));

describe('SettingsCounter', () => {
  it('ignores non-numeric and non-finite input', () => {
    const onChange = jest.fn();
    render(<SettingsCounter value={5} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('counter'), {
      target: { value: 'abc' },
    });
    fireEvent.change(screen.getByLabelText('counter'), {
      target: { value: 'Infinity' },
    });
    expect(onChange).not.toHaveBeenCalled();
  });
  it('keeps valid input, clearing, and upper bound behavior', () => {
    const onChange = jest.fn();
    render(
      <SettingsCounter
        value={5}
        minValue={2}
        maxValue={10}
        onChange={onChange}
      />,
    );
    const input = screen.getByLabelText('counter');
    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.change(input, { target: { value: '20' } });
    expect(onChange.mock.calls).toEqual([[7], [2], [10]]);
  });
});
