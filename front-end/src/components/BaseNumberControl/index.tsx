/** @jsxImportSource @emotion/react */
import { forwardRef, useState, useEffect, useMemo } from 'react';
import { connect, Options } from 'react-redux';
import { InputNumber, InputNumberProps, InputNumberValueChangeParams } from 'primereact/inputnumber';
import { IRootState } from 'src/reducers';
import { IControlProps } from 'src/@types/interfaces/control-props';
import { translate } from 'react-jhipster';
import { CommonUtil } from 'src/utils/common-util';
import ErrorMessage from 'src/components/error/ErrorMessage';
import { css } from '@emotion/react';

type INumberControlProps = StateProps & DispatchProps & InputNumberProps & IControlProps & {
    addonLeft?: string;
    addonRight?: string;
}

const fieldRadiobuttonCss = css`
.field-radiobutton>label {
    margin-left: 0.5rem;
    line-height: 1;
}
`;

const NumberControl = forwardRef((props: INumberControlProps, ref: any) => {
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

    const onChange = (event: InputNumberValueChangeParams) => {
        setValue(event?.value);
    };

return (
    <>
        {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{props.labelKey}</label> : ''}
        <div css={fieldRadiobuttonCss} className='form-control-wrap'>
            {/* <div className="p-inputgroup"> */}
                {props.addonLeft && <span className="p-inputgroup-addon">{props.addonLeft}</span>}
                <InputNumber
                    {...restProps}
                    id={controlId}
                    name={props.property}
                    value={value}
                    className={`w-100 ${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                    onChange={onChange}
                />
                {props.addonRight && <span className="p-inputgroup-addon">{props.addonRight}</span>}
            {/* </div> */}
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
    </>
);
})
NumberControl.displayName = 'NumberControl';

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
)(NumberControl);