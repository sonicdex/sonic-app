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

      if (currentStepIndex! > stepIndex!) return 'done';
      if (currentStepIndex === stepIndex) return 'active';
    }

    return 'disabled';
  };

  return getStepStatus;
};
