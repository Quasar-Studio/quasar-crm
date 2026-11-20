import { act, renderHook } from '@testing-library/react';

import { type WorkflowHttpRequestAction } from '@/workflow/types/Workflow';
import { useHttpRequestOutputSchema } from '@/workflow/workflow-steps/workflow-actions/http-request-action/hooks/useHttpRequestOutputSchema';
import { getHttpRequestOutputSchema } from '@/workflow/workflow-steps/workflow-actions/http-request-action/utils/getHttpRequestOutputSchema';

describe('useHttpRequestOutputSchema', () => {
  const actionWithSettings = (settings: object) =>
    ({ settings }) as WorkflowHttpRequestAction;

  it.each([undefined, null])(
    'opens when outputSchema is %s',
    (outputSchema) => {
      const action = actionWithSettings({ outputSchema });
      const { result } = renderHook(() =>
        useHttpRequestOutputSchema({ action }),
      );

      expect(result.current.outputSchema).toBeNull();
    },
  );

  it('opens an existing legacy output schema', () => {
    const body = { message: 'hello' };
    const action = actionWithSettings({
      outputSchema: getHttpRequestOutputSchema(body),
    });
    const { result } = renderHook(() => useHttpRequestOutputSchema({ action }));

    expect(JSON.parse(result.current.outputSchema as string)).toEqual(body);
  });

  it('saves a new output body after opening without a schema', () => {
    const action = actionWithSettings({});
    const onActionUpdate = jest.fn();
    const { result } = renderHook(() =>
      useHttpRequestOutputSchema({ action, onActionUpdate }),
    );

    act(() => result.current.handleOutputSchemaChange('{"message":"hello"}'));

    expect(onActionUpdate).toHaveBeenCalledWith({
      ...action,
      settings: {
        expectedOutputSchema: { message: 'hello' },
        outputSchema: getHttpRequestOutputSchema({ message: 'hello' }),
      },
    });
  });

  it('prefers the expected output body', () => {
    const body = { message: 'saved' };
    const action = actionWithSettings({ expectedOutputSchema: body });
    const { result } = renderHook(() => useHttpRequestOutputSchema({ action }));

    expect(JSON.parse(result.current.outputSchema as string)).toEqual(body);
  });
});
