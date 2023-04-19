
import { forwardRef, useEffect, useRef, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { FieldStyleClass } from './field-style-class';

type ITextareaControlProps = IFieldProps & {
}
// https://formik.org/docs/examples/dependent-fields
const TextareaControl = forwardRef((props: ITextareaControlProps, ref) => {
    const textboxRef = useRef(null);
    const [value, setValue] = useState(props.defaultValue || '');
    const [isChangeValue, setIsChangeValue] = useState(false);

    const getStyleClass = (attr: string) => {
        return _.get(FieldStyleClass, attr)
    }

    useEffect(() => {
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        props.updateStateElement(props.fieldName, value);
    }, [value]);

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
            <div>
                <textarea
                    name={props.fieldName}
                    disabled={props.disabled}
                    ref={textboxRef}
                    className={`${getStyleClass('input')}  ${props.disabled ? 'disable' : ''} ${isFormFieldValid(props.fieldPath) ? 'p-invalid' : ''}`}
                    value={value}
                    placeholder={props.placeholder}
                    onChange={onChangeValueEdit}
                    onBlur={onBlurValueEdit}
                    maxLength={props.maxLength}
                />
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
    )
});


export default TextareaControl;
