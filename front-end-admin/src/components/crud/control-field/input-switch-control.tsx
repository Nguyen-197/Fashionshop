
import { forwardRef, useEffect, useRef, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { FieldStyleClass } from './field-style-class';
import { InputSwitch } from 'primereact/inputswitch';

type IInputSwitchControlProps = IFieldProps & {
}
// https://formik.org/docs/examples/dependent-fields
const InputSwitchControl = forwardRef((props: IInputSwitchControlProps, ref) => {
    const [value, setValue] = useState(!!props.defaultValue || false);

    useEffect(() => {
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        props.updateStateElement(props.fieldName, value ? 1 : 0);
    }, [value]);

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
                <InputSwitch checked={value}
                    onChange={(e) => setValue(e.value)}
                    className={`${props.disabled ? 'disable' : ''} ${isFormFieldValid(props.fieldPath) ? 'p-invalid' : ''}`} />
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
    )
});


export default InputSwitchControl;
