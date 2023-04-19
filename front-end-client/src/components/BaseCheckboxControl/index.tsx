/** @jsxImportSource @emotion/react */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { connect, Options } from 'react-redux';
import { CommonUtil } from 'src/utils/common-util';
import { IRootState } from 'src/reducers';
import { IControlProps } from 'src/@types/interfaces/control-props';
import ErrorMessage from 'src/components/error/ErrorMessage';
import { Checkbox, CheckboxChangeParams, CheckboxProps } from 'primereact/checkbox';

type ICheckboxControlProps = StateProps & DispatchProps & CheckboxProps & IControlProps & {
}

const CheckboxControl = forwardRef((props: ICheckboxControlProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || 0);
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return CommonUtil.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useEffect(() => {
        const newValue = props.initialValue || 0;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    }, [props.initialValue]);

    const onChange = (event: CheckboxChangeParams) => {
        const newValue = event.value;
        setValue(newValue);
        console.log(">>>newValue: ", newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

    useImperativeHandle(ref, () => ({
    }));

    return (
        <>
            <div className='form-control-wrap'>
                <Checkbox
                    id={controlId}
                    name={props.property}
                    value={value}
                    className={`${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                    onChange={onChange}
                    {...restProps}
                />
                <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
            </div>
            {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{props.labelKey}</label> : ''}
        </>
    )
});

CheckboxControl.displayName = 'CheckboxControl';

CheckboxControl.defaultProps = {
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
)(CheckboxControl);
