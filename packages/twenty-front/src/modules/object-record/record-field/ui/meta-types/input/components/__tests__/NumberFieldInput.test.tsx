import { act, render } from '@testing-library/react';

import { FieldInputEventContext } from '@/object-record/record-field/ui/contexts/FieldInputEventContext';
import { NumberFieldInput } from '@/object-record/record-field/ui/meta-types/input/components/NumberFieldInput';

const mockInput = jest.fn();
let mockFieldType = 'percentage';

jest.mock('@/ui/field/input/components/TextInput', () => ({
  TextInput: (props: unknown) => {
    mockInput(props);
    return null;
  },
}));
jest.mock('@/ui/field/input/components/FieldInputContainer', () => ({
  FieldInputContainer: ({ children }: { children: React.ReactNode }) =>
    children,
}));
jest.mock(
  '@/object-record/record-field/ui/meta-types/hooks/useNumberField',
  () => ({
    useNumberField: () => ({
      fieldDefinition: { metadata: { settings: { type: mockFieldType } } },
      draftValue: '',
      setDraftValue: jest.fn(),
    }),
  }),
);
jest.mock(
  '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow',
  () => ({
    useAvailableComponentInstanceIdOrThrow: () => 'test',
  }),
);

describe('NumberFieldInput percentage', () => {
  beforeEach(() => {
    mockFieldType = 'percentage';
  });
  it.each(['onEnter', 'onEscape', 'onTab', 'onShiftTab', 'onClickOutside'])(
    'converts a percentage on %s',
    (eventName) => {
      const handler = jest.fn();
      render(
        <FieldInputEventContext.Provider value={{ [eventName]: handler }}>
          <NumberFieldInput />
        </FieldInputEventContext.Provider>,
      );
      const input = mockInput.mock.lastCall?.[0];

      act(() => {
        if (eventName === 'onClickOutside') {
          input[eventName](new MouseEvent('click'), '75%');
        } else {
          input[eventName]('75%');
        }
      });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ newValue: 0.75, skipPersist: false }),
      );
    },
  );

  it.each([
    ['', null, false],
    ['invalid%', undefined, true],
    ['12.5', 0.125, false],
  ])('handles %s on Enter', (value, expected, skipPersist) => {
    const onEnter = jest.fn();
    render(
      <FieldInputEventContext.Provider value={{ onEnter }}>
        <NumberFieldInput />
      </FieldInputEventContext.Provider>,
    );
    const input = mockInput.mock.lastCall?.[0];

    act(() => input.onEnter(value));

    expect(onEnter).toHaveBeenCalledWith({ newValue: expected, skipPersist });
  });

  it('preserves ordinary number input', () => {
    mockFieldType = 'number';
    const onEnter = jest.fn();
    render(
      <FieldInputEventContext.Provider value={{ onEnter }}>
        <NumberFieldInput />
      </FieldInputEventContext.Provider>,
    );

    act(() => mockInput.mock.lastCall?.[0].onEnter('12.5'));

    expect(onEnter).toHaveBeenCalledWith({
      newValue: 12.5,
      skipPersist: false,
    });
  });
});
