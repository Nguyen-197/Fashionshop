
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { FieldStyleClass } from './field-style-class';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import 'moment-timezone';

type IDateTimeControlProps = IFieldProps & {
    dateFormat?: string;
    showTime?: boolean;
    hourFormat?: string;
    view?: string;
    monthNavigator?: boolean;
    yearNavigator?: boolean;
    minDateBy?: any;
    maxDateBy?: any;
}
// https://formik.org/docs/examples/dependent-fields , 'YYYY-MM-DDTHH:MM:ss.SSSZ'
const DateTimeControl = forwardRef((props: IDateTimeControlProps, ref) => {
    const [value, setValue] = useState(props.defaultValue ? moment.utc(props.defaultValue).toDate() : null);

    const getStyleClass = (attr: string) => {
        return _.get(FieldStyleClass, attr)
    }

    useEffect(() => {
        setValue(props.defaultValue ? moment.utc(props.defaultValue).toDate() : null);
    }, [props.defaultValue]);

    useEffect(() => {
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        props.updateStateElement(props.fieldName, value ? value : null);
    }, [value?.getTime()]);

    const onChange = (e) => {
        setValue(e.value)
    }

    const isFormFieldValid = (name) => {
        const _touched = _.get(props?.formik?.touched, name);
        return !!(_touched && props?.formik?.errors[name])
    };

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{props?.formik?.errors[name]}</small>;
    };
    const convertDatetime = (object) => {
        if (object && typeof object === 'string') {
            return moment.utc(props.defaultValue).toDate() || null
        }
        return object
    } 
    return (
        <>
            <div>
                <Calendar
                    showIcon
                    {...props}
                    value={value}
                    onChange={onChange}
                    required={false}
                    className={`${getStyleClass('datetime')} ${props.disabled ? 'disable' : ''} ${isFormFieldValid(props.fieldPath) ? 'p-invalid' : ''}`}
                    minDate={props.minDateBy ? convertDatetime(_.get(props?.formik?.values || {}, props.minDateBy)) : null}
                    maxDate={props.maxDateBy ? convertDatetime(_.get(props?.formik?.values || {}, props.maxDateBy)) : null}
                ></Calendar>
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
    )
});

DateTimeControl.defaultProps = {
    dateFormat: 'dd/mm/yy',
    showTime: false,
    hourFormat: '24',
    view: 'date',
}

export default DateTimeControl;
