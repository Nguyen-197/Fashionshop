import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { connect, Options } from 'react-redux';
import { Calendar, CalendarChangeParams, CalendarProps } from 'primereact/calendar';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { IControlProps } from 'src/@types/interfaces/control-props';
import ErrorMessage from 'src/components/error/ErrorMessage';
type IControlDateProps = StateProps & DispatchProps & CalendarProps & IControlProps & {
}

const ControlDate = forwardRef((props: IControlDateProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue);
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return CommonUtil.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useImperativeHandle(ref, () => ({
    }));

    useEffect(() => {
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, value);
    }, [value]);

    const onChange = (e: CalendarChangeParams) => {
        setValue(e?.value);
    };

return <>
        {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{props.labelKey}</label> : ''}
        <div className='form-control-wrap'>
            <Calendar
                {...restProps}
                id={controlId}
                name={props.property}
                value={value}
                className={`w100${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                onChange={onChange}
                showIcon />
            <ErrorMessage errors={props?.errors} touched={props?.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
        </>
});

ControlDate.displayName = 'ControlDate';
ControlDate.defaultProps = {
    dateFormat: 'dd/mm/yy'
}
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
)(ControlDate);
