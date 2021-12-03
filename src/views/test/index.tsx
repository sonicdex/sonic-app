import { createTestBatch } from '@/integrations/transactions';

export const TestView = () => {
  const { execute, state } = createTestBatch();

  return (
    <div>
      {state}&nbsp;
      <button onClick={() => execute()}>EXECUTE</button>
    </div>
  );
};
