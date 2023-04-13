import React, { forwardRef, useState, useEffect, useMemo } from 'react';
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/reducers';
import { IControlProps } from 'src/@types/interfaces/control-props';
import { CommonUtil } from 'src/utils/common-util';
import ErrorMessage from 'src/components/error/ErrorMessage';
import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';

type ITextareaControlProps = StateProps & DispatchProps & InputTextareaProps & IControlProps & {
}

const TextareaControl = forwardRef((props: ITextareaControlProps, ref: any) => {
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

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event?.target?.value);
    };

return (
    <>
        {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{props.labelKey}</label> : ''}
        <div className='form-control-wrap'>
            <InputTextarea
                {...restProps}
                id={controlId}
                name={props.property}
                value={value}
                className={`form-control${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                onChange={onChange}
            />
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
    </>
    );
})
TextareaControl.displayName = 'TextareaControl';

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
)(TextareaControl);