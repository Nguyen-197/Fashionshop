
import { forwardRef, useEffect, useRef, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { FieldStyleClass } from './field-style-class';

type ITextControlProps = IFieldProps & {
}
// https://formik.org/docs/examples/dependent-fields
const TextControl = forwardRef((props: ITextControlProps, ref) => {
    const textboxRef = useRef(null);
    const [value, setValue] = useState(props.defaultValue || '');
    const [isChangeValue, setIsChangeValue] = useState(false);

    const getStyleClass = (attr: string) => {
        return _.get(FieldStyleClass, attr)
    }
    useEffect(() => {
        setValue(props.defaultValue);
    }, [props.defaultValue]);
    useEffect(() => {
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        props.updateStateElement(props.fieldName, value);
    }, [value]);

    useEffect(() => {
        if (props.isFocus && textboxRef && textboxRef.current) {
            textboxRef.current.focus();
        }
    }, [props.isFocus]);

    const onChangeValueEdit = (event) => {
        setIsChangeValue(true);
        const val = event.target.value;
        setValue(val);
        if (props.formik) {
            props.formik.handleChange(event);
        }
    }

    const onBlurValueEdit = (event) => {
        if (isChangeValue) {
            setValue(event.target.value?.trim());
        }
    }

    const isFormFieldValid = (name) => {
        const _touched = _.get(props?.formik?.touched, name);
        return !!(_touched && props?.formik?.errors[name])
    };
    // const isFormFieldValid = (name) => !!(props?.formik?.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{props?.formik?.errors[name]}</small>;
    };

    return (
        <>
            <div>
                {props.rateValue? <div className='row'>
                    <div className='col-9 col-md-9 p-input-icon-right pr-0'>
                    {props.suffixesIcon && <i className={`pi ${props.suffixesIcon}`}/>}
                    {props.suffixesContent && <span className="my-suffix">{props.suffixesContent}</span>}
                            <input
                            name={props.fieldName}
                            disabled={props.disabled}
                            ref={textboxRef}
                            className={`${getStyleClass('input')} ${props.disabled ? 'disable' : ''} ${isFormFieldValid(props.fieldPath) ? 'p-invalid' : ''} ${props.textAlign ? `text-${props.textAlign}`: ''}`}
                            value={value}
                            type="text"
                            placeholder={props.placeholder}
                            onChange={onChangeValueEdit}
                            onBlur={onBlurValueEdit}
                            maxLength={props.maxLength}
                        />
                    </div>
                    <div className='col-3 col-md-3 p-input-icon-right'>
                        <i className="pi pi-rate"/>
                        <div className="lable-rate">{props.rateValue}</div>
                    </div>
                </div> : <div className="p-input-icon-right w-100">
                    {props.suffixesIcon && <i className={`pi ${props.suffixesIcon}`}/>}
                    {props.suffixesContent && <span className="my-suffix">{props.suffixesContent}</span>}
                    <input
                        name={props.fieldName}
                        disabled={props.disabled}
                        ref={textboxRef}
                        className={`${getStyleClass('input')} ${props.disabled ? 'disable' : ''} ${isFormFieldValid(props.fieldPath) ? 'p-invalid' : ''} ${props.textAlign ? `text-${props.textAlign}`: ''}`}
                        value={value}
                        type="text"
                        placeholder={props.placeholder}
                        onChange={onChangeValueEdit}
                        onBlur={onBlurValueEdit}
                        maxLength={props.maxLength}
                    />
                </div> }
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
    )
});


export default TextControl;
