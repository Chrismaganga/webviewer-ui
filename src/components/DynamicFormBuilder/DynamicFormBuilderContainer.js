import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import DynamicFormBuilder from './DynamicFormBuilder';

const DynamicFormBuilderContainer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isOpen = useSelector(state => selectors.isElementOpen(state, DataElements.DYNAMIC_FORM_BUILDER));

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.DYNAMIC_FORM_BUILDER));
  };

  return <DynamicFormBuilder isOpen={isOpen} onClose={closeModal} />;
};

export default DynamicFormBuilderContainer;
