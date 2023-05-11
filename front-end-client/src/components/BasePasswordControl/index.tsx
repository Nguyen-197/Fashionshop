import { forwardRef, useState, useEffect, useMemo, ChangeEvent } from 'react';
import { connect, Options } from 'react-redux';
import { Password , PasswordProps} from 'primereact/password';
import { IRootState } from 'src/reducers';
import { IControlProps } from 'src/@types/interfaces/control-props';
import { CommonUtil } from 'src/utils/common-util';
import ErrorMessage from 'src/components/error/ErrorMessage';

type IPasswordControlProps = StateProps & DispatchProps & PasswordProps & IControlProps & {
}

const TextControl = forwardRef((props: IPasswordControlProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return CommonUtil.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useEffect(() => {
        const newValue = props.initialValue || '';
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    }, [props.initialValue]);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

return (
    <>
        {props.labelKey ? <label className={`control-label mr-3 ${props.required ? 'required' : ''}`} htmlFor={props.property}>{props.labelKey}</label> : ''}
        <div className='form-control-wrap'>
            <Password
                {...restProps}
                id={controlId}
                name={props.property}
                value={value}
                className={`w-100${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                onChange={onChange}
            />
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
    </>
    );
})
TextControl.displayName = 'TextControl';

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