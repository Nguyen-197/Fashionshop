
import { forwardRef, useEffect, useRef, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { FieldStyleClass } from './field-style-class';

type INumbericControlProps = IFieldProps & {
    objectParent?: any;
}
// https://formik.org/docs/examples/dependent-fields
const NumbericControl = forwardRef((props: INumbericControlProps, ref) => {
    const textboxRef = useRef(null);
    const [value, setValue] = useState(Number.parseInt(props.defaultValue) || '');
    const [isChangeValue, setIsChangeValue] = useState(false);

    const getStyleClass = (attr: string) => {
        return _.get(FieldStyleClass, attr)
    }

    useEffect(() => {
        if (props.setValueDirectly && typeof props.setValueDirectly == "function") {
            setValue(props.setValueDirectly(props.objectParent) || '');
        }
    }, [props.objectParent]);

    useEffect(() => {
        setValue(Number.parseInt(props.defaultValue) || '');
    }, [props.defaultValue]);

    useEffect(() => {
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        props.updateStateElement(props.fieldName, value && value != 0 ? value : null);
    }, [value?.toString()]);

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
            setValue(event.target.value);
        }
    }

    const isFormFieldValid = (name) => {
        const _touched = _.get(props?.formik?.touched, name);
        return !!(_touched && props?.formik?.errors[name])
    };

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{props?.formik?.errors[name]}</small>;
    };

    return (
        <>
            <>
            <div>
                {props.rateValue? <div className='row'>
                    <div className='col-6 col-md-6 col-lg-7 p-input-icon-right w-100 pr-0'>
                    {props.suffixesIcon && <i className={`pi ${props.suffixesIcon}`}/>}
                    {props.suffixesContent && <span className="my-suffix">{props.suffixesContent}</span>}
                            <input
                            name={props.fieldName}
                            disabled={props.disabled}
                            ref={textboxRef}
                            className={`${getStyleClass('input')} ${props.disabled ? 'disable' : ''} ${isFormFieldValid(props.fieldPath) ? 'p-invalid' : ''}
                            ${props.suffixesIcon || props.suffixesContent? 'no-spin' : ''} ${props.textAlign ? `text-${props.textAlign}`: ''}`}
                            value={value}
                            type="number"
                            placeholder={props.placeholder}
                            onChange={onChangeValueEdit}
                            onBlur={onBlurValueEdit}
                            maxLength={props.maxLength}
                        />
                    </div>
                    <div className='col-6 col-md-6 col-lg-5 p-input-icon-right  w-100'>
                        <i className="pi pi-rate"/>
                        <div className="lable-rate">{props.rateValue(props.objectParent)}</div>
                    </div>
                </div> : <div className="p-input-icon-right  w-100">
                    {props.suffixesIcon && <i className={`pi ${props.suffixesIcon}`}/>}
                    {props.suffixesContent && <span className="my-suffix">{props.suffixesContent}</span>}
                    <input
                        name={props.fieldName}
                        disabled={props.disabled}
                        ref={textboxRef}
                        className={`${getStyleClass('input')} ${props.disabled ? 'disable' : ''} ${isFormFieldValid(props.fieldPath) ? 'p-invalid' : ''}
                        ${props.suffixesIcon || props.suffixesContent? 'no-spin' : ''} ${props.textAlign ? `text-${props.textAlign}`: ''}`}
                        value={value}
                        type="number"
                        placeholder={props.placeholder}
                        onChange={onChangeValueEdit}
                        onBlur={onBlurValueEdit}
                        maxLength={props.maxLength}
                    />
                </div> }
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
        </>
    )
});


export default NumbericControl;
