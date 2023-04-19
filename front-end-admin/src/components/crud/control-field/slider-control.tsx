
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { FieldStyleClass } from './field-style-class';
import { Slider } from 'primereact/slider';

type ISliderControlProps = IFieldProps & {
    defaultValue? : number;
    min?: number;
    max?: number;
    step?: number;
    title?: string;
    unitTitle?: string;
    renderTextValue?: (value) => string;
}
// https://formik.org/docs/examples/dependent-fields
const SliderControl = forwardRef((props: ISliderControlProps, ref) => {
    const [value, setValue] = useState(props.defaultValue || props.min);

    useEffect(() => {
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        props.updateStateElement(props.fieldName, value);
    }, [value]);

    const isFormFieldValid = (name) => {
        const _touched = _.get(props?.formik?.touched, name);
        return !!(_touched && props?.formik?.errors[name])
    };

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{props?.formik?.errors[name]}</small>;
    };

    const getStyleClass = (attr: string) => {
        return _.get(FieldStyleClass, attr)
    }
    useEffect(() => {
        if (props.max && value > props.max) {
            setValue(props.max)
        } else if (props.min && value < props.min) {
            setValue(props.min)
        }
    }, [props.min, props.max])
    const selectedValueText = useMemo(() => {
        if (props.renderTextValue) {
            return props.renderTextValue(value);
        }
        return `${value} ${props.unitTitle}`
    }, [value])
    return (
        <>
            <div className="evn-silder">
                <div className="d-flex justify-content-between">
                    <div className="text">{props.title}</div>
                    <div className="selected-value">{selectedValueText}</div>
                </div>
                <Slider value={value} onChange={(e) => setValue(e.value)} min={props.min} max={props.max} step={props.step}
                    className={`${props.disabled ? 'disable' : ''} ${isFormFieldValid(props.fieldPath) ? 'p-invalid' : ''}`}/>
                {/* <div className="text">
                    <div>{props.min} {props.unitTitle}</div>
                </div> */}
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
    )
});
SliderControl.defaultProps = {
    min: 0,
    max: 100,
    step: 1
}

export default SliderControl;
