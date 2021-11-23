import { useState } from 'react';
import { Collapse } from "@chakra-ui/react";
import { Box, Flex } from "@chakra-ui/react"
import { closeSrc } from '@/assets';

type InformationBoxTypes = {
  onClose?: () => void;
};

export const InformationBox = ({ onClose }: InformationBoxTypes) => {
  const [collapse, setCollapse] = useState(true);

  const handleClose = () => {
    setCollapse(false);
    setTimeout(onClose, 500);
  };

  return (
    <>
      <Collapse in={collapse} unmountOnExit={true}>
        <Box
          bg="rgba(57, 77, 231, 0.2)"
          pt="16px"
          px="20px"
          pb="21px"
          mb="20px"
          borderRadius={20}
        >
          <Flex
            direction="row"
            justifyContent="space-between"
            mb="7px"
          >
            <Box
              as="h3"
              fontSize="18px"
              fontWeight="700"
              color="#F6FCFD"
            >
              Liquidity Provider Rewards
            </Box>
            <Box
              as="img"
              w="18px"
              cursor="pointer"
              onClick={handleClose}
              src={closeSrc}
            />
          </Flex>
          <Box
            as="p"
            color="#888E8F"
          >
            Liquidity providers earn a 0.25% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. If you want to learn review our blog post.
          </Box>
        </Box>
      </Collapse>
    </>
  );
}
