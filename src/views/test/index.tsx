import { useTestBatch } from '@/integrations/transactions';

export const TestView = () => {
  const { execute, state } = useTestBatch();

  return (
    <div>
      {state}&nbsp;
      <button onClick={() => execute()}>EXECUTE</button>
    </div>
  );
};
