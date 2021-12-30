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
}: UseStepStatusMemoOptions<Step>) => {
  const getStepStatus = (step: Step) => {
    if (activeStep) {
      const currentStepIndex = steps?.indexOf(activeStep);
      const stepIndex = steps?.indexOf(step);

      if (currentStepIndex! > stepIndex!) return StepStatus.Disabled;
      if (currentStepIndex === stepIndex) return StepStatus.Active;
    }

    return StepStatus.Disabled;
  };

  return getStepStatus;
};
