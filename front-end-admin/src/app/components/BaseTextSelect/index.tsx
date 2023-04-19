import { forwardRef, useState, useEffect, useMemo, ChangeEvent, useRef, useImperativeHandle } from 'react';
import { connect, Options } from 'react-redux';
import { InputTextProps } from 'primereact/inputtext';
import { IRootState } from 'src/reducers';
import { IControlProps } from 'src/@types/interfaces/control-props';
import { CommonUtil } from 'src/utils/common-util';
import ErrorMessage from 'src/components/error/ErrorMessage';
import { OverlayPanel } from 'primereact/overlaypanel';

type ITextSelectControlProps = StateProps & DispatchProps & InputTextProps & IControlProps & {
    labelAdd: string;
    textAlign?: any;
    isFocus?: boolean;
    isAdd?: boolean;
    onAdd?: Function;
    temlateBody?: JSX.Element;
    showLabel?: boolean;
}

const TextSelectControl = forwardRef((props: ITextSelectControlProps, ref: any) => {
    const textboxRef = useRef(null);
    const overlayRef = useRef(null);
    const wrapOverlayRef = useRef(null);
    const [value, setValue] = useState(props.initialValue || '');
    const [isChangeValue, setIsChangeValue] = useState(false);
    const [datasource, setDatasource] = useState([]);
    const { errors, touched, property, labelKey, initialValue, fieldPath, required, showLabel, callbackValueChange, ...restProps } = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo((): boolean => {
        return CommonUtil.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useImperativeHandle(ref, () => ({
        focusIn() {
            textboxRef.current && textboxRef.current.focus();
        }
    }))

    useEffect(() => {
        if (props.isFocus && textboxRef && textboxRef.current) {
            textboxRef.current.focus();
        }
    }, [props.isFocus]);

    useEffect(() => {
        const newValue = props.initialValue || "";
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    }, [props.initialValue]);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

    const onBlur = (event) => {
        if (isChangeValue) {
            const newValue = event.target.value?.trim();
            setValue(newValue);
            props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
        }
        const timerId = setTimeout(() => {
            overlayRef.current && overlayRef.current.hide();
            clearTimeout(timerId);
        }, 500);
    }

    const onFocus = async (event) => {
        if (overlayRef.current) {
            overlayRef.current.width = event.target.offsetWidth;
        }
        overlayRef.current && overlayRef.current.toggle(event);
    }

    const onAdd = () => {
        props.onAdd && props.onAdd();
    }

    return (
        <>
            {props.labelKey && props.showLabel? <label className={`control-label ${props.required ? 'required' : ''} `} htmlFor={props.property}>{props.labelKey}</label> : ''}
            <div className={`form-control-wrap text-select-control`} style={{ width: 500 }}>
                <input
                    type="text"
                    name={props.property}
                    disabled={props.disabled}
                    ref={textboxRef}
                    className={`form-control p-inputtext p-component w-100 ${props.disabled ? 'disable' : ''} ${isInvalid ? 'p-invalid' : ''} ${props.textAlign ? `text-${props.textAlign}`: ''}`}
                    aria-haspopup
                    aria-controls="overlay_panel"
                    value={value}
                    placeholder={props.placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    maxLength={props.maxLength}
                />
                <OverlayPanel
                    ref={overlayRef}
                    id="overlay_panel"
                    className="overlay-dropdown"
                    appendTo='self'
                >
                    { props.isAdd &&
                        <div className="p-heading" onClick={onAdd}>
                            <i className="pi pi-plus"></i>
                            <span className="title">{props.labelAdd}</span>
                        </div>
                    }
                    <div className="p-content">
                        {props.temlateBody && props.temlateBody}
                    </div>
                </OverlayPanel>
                <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath} />
            </div>
        </>
    );
})
TextSelectControl.displayName = 'TextSelectControl';
TextSelectControl.defaultProps = {
    isAdd: true
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
)(TextSelectControl);