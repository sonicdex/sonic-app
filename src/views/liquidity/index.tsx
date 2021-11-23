import { useState } from 'react';
import { Box } from "@chakra-ui/react"
import { Header, InformationBox } from './components';

export const Liquidity = () => {
  const [displayInformation, setDisplayInformation] = useState(true);
  const onClose = () => { console.log("Closed information"); setDisplayInformation(false); };

  return (
    <div>
      { displayInformation && <InformationBox onClose={onClose}/> }
      <Header />
      <Box
        as="p"
        mt="35px"
        color="#888E8F"
        textAlign="center"
        fontWeight={700}
      >
        You have no liquidity positions
      </Box>
    </div>
  );
};
