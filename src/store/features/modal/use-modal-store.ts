import {
  FeatureState,
  selectModalState,
  setCurrentModal,
  setCurrentModalState,
  setOnClose,
  setCurrentModalData,
  setModalState,
  clearModal,
} from '@/store';

import { useAppDispatch, useAppSelector } from '@/store';

export const useModalStore = () => {
  const { currentModal, currentModalState, state } =
    useAppSelector(selectModalState);
  const dispatch = useAppDispatch();

  const _setCurrentModal = (currentModal: string) => {
    dispatch(setCurrentModal(currentModal));
  };

  const _setCurrentModalState = (currentModalState: string) => {
    dispatch(setCurrentModalState(currentModalState));
  };

  const _setModalState = (state: FeatureState) => {
    dispatch(setModalState(state));
  };

  const _setOnClose = (onClose: () => any) => {
    dispatch(setOnClose(onClose));
  };

  const _clearModal = () => {
    dispatch(clearModal());
  };

  const _setCurrentModalData = (currentModalData: any) => {
    dispatch(setCurrentModalData(currentModalData));
  };

  return {
    currentModal,
    currentModalState,
    state,
    setOnClose: _setOnClose,
    setCurrentModalData: _setCurrentModalData,
    setCurrentModal: _setCurrentModal,
    setCurrentModalState: _setCurrentModalState,
    setModalState: _setModalState,
    clearModal: _clearModal,
  };
};
