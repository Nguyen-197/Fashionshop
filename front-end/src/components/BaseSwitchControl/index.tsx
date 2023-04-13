/** @jsxImportSource @emotion/react */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { connect, Options } from 'react-redux';
import { InputSwitch, InputSwitchChangeParams, InputSwitchProps } from 'primereact/inputswitch';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { CommonUtil } from 'src/utils/common-util';
import { IRootState } from 'src/reducers';
import { IControlProps } from 'src/@types/interfaces/control-props';
import ErrorMessage from 'src/components/error/ErrorMessage';

type ISwitchControlProps = StateProps & DispatchProps & InputSwitchProps & IControlProps & {
}

const SwitchControl = forwardRef((props: ISwitchControlProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return CommonUtil.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useEffect(() => {
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, value);
    }, [value]);

    const onChange = (event: InputSwitchChangeParams) => {
        setValue(event?.value);
    };

    useImperativeHandle(ref, () => ({
    }));

    return (
        <>
            {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{props.labelKey}</label> : ''}
            <div className='form-control-wrap'>
                <InputSwitch
                    {...restProps}
                    id={controlId}
                    name={props.property}
                    checked={value}
                    className={`${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                    onChange={onChange}
                />
                <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
            </div>
        </>
    )
});

SwitchControl.displayName = 'SwitchControl';

SwitchControl.defaultProps = {
};

const mapStateToProps = ({ }: IRootState) => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;
const options = { forwardRef: true };
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
)(SwitchControl);
