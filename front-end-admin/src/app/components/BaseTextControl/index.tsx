import { forwardRef, useState, useEffect, useMemo, ChangeEvent } from 'react';
import { connect, Options } from 'react-redux';
import { InputText, InputTextProps } from 'primereact/inputtext';
import { IRootState } from 'src/reducers';
import { IControlProps } from 'src/@types/interfaces/control-props';
import { CommonUtil } from 'src/utils/common-util';
import ErrorMessage from 'src/components/error/ErrorMessage';
import { setTimeout } from 'timers/promises';
import { clearTimeout } from 'timers';
import useDebounce from 'src/utils/useDebounce';

type ITextControlProps = StateProps & DispatchProps & InputTextProps & IControlProps & {
}

const TextControl = forwardRef((props: ITextControlProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const [isFocus, setIsFocus] = useState(false);
    const focusChange = useDebounce(isFocus, 500);

    const controlId = props.id || props.property;
    const { errors, touched, property, labelKey, initialValue, fieldPath, required, showLabel, callbackValueChange, ...restProps } = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo((): boolean => {
        return CommonUtil.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useEffect(() => {
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, value);
    }, [value]);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event?.target?.value);
    };

    return (
        <>
            {props.labelKey && props.showLabel ? <label className={`control-label ${props.required ? 'required' : ''} `} htmlFor={props.property}>{props.labelKey}</label> : ''}
            <div className={`form-control-wrap ${focusChange ? 'is-focus-zune' : ''}`}>
                <InputText
                    {...restProps}
                    id={controlId}
                    onFocus={() => { setIsFocus(true) }}
                    onBlur={() => { setIsFocus(false) }}
                    name={props.property}
                    value={value}
                    className={`w-100${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                    onChange={onChange}
                />
                <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath} />
            </div>
        </>
    );
})
TextControl.displayName = 'TextControl';

TextControl.defaultProps = {
    showLabel: true
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
)(TextControl);