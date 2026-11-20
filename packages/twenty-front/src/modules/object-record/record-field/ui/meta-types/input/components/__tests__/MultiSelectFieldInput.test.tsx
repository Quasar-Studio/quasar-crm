import { act, render } from '@testing-library/react';

import { FieldInputEventContext } from '@/object-record/record-field/ui/contexts/FieldInputEventContext';
import { MultiSelectFieldInput } from '@/object-record/record-field/ui/meta-types/input/components/MultiSelectFieldInput';

let mockDraft: string[] | null | undefined;
const mockInput = jest.fn();

jest.mock(
  '@/object-record/record-field/ui/meta-types/hooks/useMultiSelectField',
  () => ({
    useMultiSelectField: () => ({
      fieldDefinition: { fieldMetadataId: 'field', metadata: { options: [] } },
      fieldValues: ['SAVED'],
      draftValue: mockDraft,
      setDraftValue: jest.fn(),
    }),
  }),
);
jest.mock(
  '@/object-record/record-field/ui/meta-types/hooks/useAddSelectOption',
  () => ({
    useAddSelectOption: () => ({ addSelectOption: jest.fn() }),
  }),
);
jest.mock(
  '@/object-record/record-field/ui/meta-types/hooks/useCanAddSelectOption',
  () => ({
    useCanAddSelectOption: () => ({ canAddSelectOption: false }),
  }),
);
jest.mock(
  '@/object-record/record-field/ui/meta-types/hooks/useFilteredSelectOptionsFromRLSPredicates',
  () => ({
    useFilteredSelectOptionsFromRLSPredicates: () => ({ filteredOptions: [] }),
  }),
);
jest.mock(
  '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow',
  () => ({
    useAvailableComponentInstanceIdOrThrow: () => 'field',
  }),
);
jest.mock('@/ui/field/input/components/MultiSelectInput', () => ({
  MultiSelectInput: (props: unknown) => {
    mockInput(props);
    return null;
  },
}));

describe('MultiSelectFieldInput', () => {
  it.each([
    [undefined, ['SAVED']],
    [null, null],
    [[], []],
    [['NEW'], ['NEW']],
  ])('submits draft %s as %s on close', (draft, expected) => {
    mockDraft = draft;
    const onSubmit = jest.fn();
    render(
      <FieldInputEventContext.Provider value={{ onSubmit }}>
        <MultiSelectFieldInput />
      </FieldInputEventContext.Provider>,
    );

    act(() => mockInput.mock.lastCall?.[0].onCancel());

    expect(onSubmit).toHaveBeenCalledWith({ newValue: expected });
  });
});
