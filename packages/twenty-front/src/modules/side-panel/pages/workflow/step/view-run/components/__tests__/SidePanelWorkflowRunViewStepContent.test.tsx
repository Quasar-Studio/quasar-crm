import { render } from '@testing-library/react';

import { SidePanelWorkflowRunViewStepContent } from '@/side-panel/pages/workflow/step/view-run/components/SidePanelWorkflowRunViewStepContent';
import { flowComponentState } from '@/workflow/states/flowComponentState';
import { workflowSelectedNodeComponentState } from '@/workflow/workflow-diagram/states/workflowSelectedNodeComponentState';

let mockFlow: object | undefined;

jest.mock(
  '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue',
  () => ({
    useAtomComponentStateValue: (state: unknown) => {
      if (state === flowComponentState) return mockFlow;
      if (state === workflowSelectedNodeComponentState) return 'step';
      return 'NODE';
    },
  }),
);
jest.mock(
  '@/ui/utilities/state/component-state/hooks/useComponentInstanceStateContext',
  () => ({
    useComponentInstanceStateContext: () => ({ instanceId: 'panel' }),
  }),
);
jest.mock('@/workflow/hooks/useWorkflowRunIdOrThrow', () => ({
  useWorkflowRunIdOrThrow: () => 'run',
}));
jest.mock('@/workflow/hooks/useWorkflowRun', () => ({
  useWorkflowRun: () => ({ state: {} }),
}));
jest.mock('@/workflow/utils/getStepDefinitionOrThrow', () => ({
  getStepDefinitionOrThrow: () => ({ type: 'trigger' }),
}));
jest.mock(
  '@/workflow/workflow-steps/utils/getWorkflowRunStepExecutionStatus',
  () => ({
    getWorkflowRunStepExecutionStatus: () => 'NOT_STARTED',
  }),
);
jest.mock(
  '@/side-panel/pages/workflow/step/view-run/utils/getShouldFocusNodeTab',
  () => ({
    getShouldFocusNodeTab: () => true,
  }),
);
jest.mock(
  '@/side-panel/pages/workflow/step/view-run/utils/getIsInputTabDisabled',
  () => ({
    getIsInputTabDisabled: () => false,
  }),
);
jest.mock(
  '@/side-panel/pages/workflow/step/view-run/utils/getIsOutputTabDisabled',
  () => ({
    getIsOutputTabDisabled: () => false,
  }),
);
jest.mock(
  '@/workflow/workflow-steps/components/WorkflowRunStepNodeDetail',
  () => ({
    WorkflowRunStepNodeDetail: () => <div data-testid="node-detail" />,
  }),
);

describe('SidePanelWorkflowRunViewStepContent', () => {
  it('waits for the flow and restores the step detail after refetch', () => {
    mockFlow = { trigger: {}, steps: [] };
    const { queryByTestId, rerender } = render(
      <SidePanelWorkflowRunViewStepContent />,
    );

    expect(queryByTestId('node-detail')).toBeInTheDocument();
    mockFlow = undefined;
    rerender(<SidePanelWorkflowRunViewStepContent />);
    expect(queryByTestId('node-detail')).not.toBeInTheDocument();
    mockFlow = { trigger: {}, steps: [] };
    rerender(<SidePanelWorkflowRunViewStepContent />);
    expect(queryByTestId('node-detail')).toBeInTheDocument();
  });
});
