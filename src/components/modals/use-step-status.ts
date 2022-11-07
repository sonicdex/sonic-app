import { useCallback } from 'react';

export enum StepStatus {
  Active = 'active',
  Disabled = 'disabled',
  Done = 'done',
}

type UseStepStatusMemoOptions<Step> = {
  activeStep?: Step;
  steps?: Step[];
};

export const useStepStatus = <Step>({
  activeStep,
  steps,
}: UseStepStatusMemoOptions<Step>) =>
  useCallback(
    (step: Step) => {
      if (activeStep) {
        const selectedStepIndex = steps?.indexOf(step);
        const activeStepIndex = steps?.indexOf(activeStep);

        if (activeStepIndex! > selectedStepIndex!) return StepStatus.Done;
        if (activeStepIndex === selectedStepIndex) return StepStatus.Active;
      }

      return StepStatus.Disabled;
    },
    [activeStep, steps]
  );
