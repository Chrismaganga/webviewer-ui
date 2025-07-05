import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import FlyoutItemContainer from '../ModularComponents/FlyoutItemContainer';

/**
 * A button that opens the Dynamic Form Builder modal.
 * @name dynamicFormBuilderButton
 * @memberof UI.Components.PresetButton
 */
const DynamicFormBuilderButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(actions.openElement(DataElements.DYNAMIC_FORM_BUILDER));
  };

  return isFlyoutItem ? (
    <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} />
  ) : (
    <ActionButton
      className={'PresetButton dynamicFormBuilderButton'}
      dataElement="dynamicFormBuilderButton"
      title="Dynamic Form Builder"
      img="icon-form-field-edit"
      onClick={handleClick}
    />
  );
});

DynamicFormBuilderButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
DynamicFormBuilderButton.displayName = 'DynamicFormBuilderButton';

export default DynamicFormBuilderButton;
