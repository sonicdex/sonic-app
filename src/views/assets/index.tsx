import { useState } from 'react';
import { Box } from '@chakra-ui/react';

import { InformationBox, Header } from '@/components';

const InformationDescription = () => (
  <Box as="p" color="#888E8F">
    Assets description here
  </Box>
);

export const Assets = () => {
  const showInformation = true;

  return (
    <>
      { showInformation && (
        <InformationBox title="Assets Details" mb="37px">
          <InformationDescription />
        </InformationBox>
      )}
      <Header
        title="Your Assets"
        buttonText="Deposit Assets"
        onButtonClick={() => console.log('deposit asset flow')}
      />
    </>
  )
};
