
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { FieldStyleClass } from './field-style-class';
import { RadioButton } from 'primereact/radiobutton';
import { connect, Options } from 'react-redux';
import { IRootState } from '../../../reducers';
import { translate } from 'react-jhipster';

type IRadioControlProps = IFieldProps & StateProps & DispatchProps & {
    datasource?: [];
    isMultiLanguage?: boolean;
}
const RadioControl = forwardRef((props: IRadioControlProps, ref) => {
    const [value, setValue] = useState(props.defaultValue);

    const getStyleClass = (attr: string) => {
        return _.get(FieldStyleClass, attr)
    }

    useEffect(() => {
        setValue(props.defaultValue);
    }, [props.defaultValue]);

    useEffect(() => {
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        props.updateStateElement(props.fieldName, value);
    }, [value]);

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

    const datasource = useMemo(() => {
        if (props.isMultiLanguage) {
            const _datasource = _.cloneDeep(props.datasource);
            return _datasource.map(e => {
                e[props.fieldLabel] = translate(e[props.fieldLabel]);
                return e;
            });
        }
        return props.datasource;
    }, [props.datasource, props.currentLocale])

    return (
        <>
            <div>
                <div className="d-flex">
                    {datasource.map((item, idx) => {
                        return (
                            <div key={idx} className="field-radiobutton mr-5 d-flex">
                                <RadioButton inputId={`${props.fieldName}_${item[props.fieldValue]}`} name={props.fieldName}
                                    value={item[props.fieldValue]} onChange={onChange} checked={value === item[props.fieldValue]}/>
                                <label htmlFor={`${props.fieldName}_${item[props.fieldValue]}`}>{item[props.fieldLabel]}</label>
                            </div>
                        )
                    })}
                </div>
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
    )
});

RadioControl.defaultProps = {
    datasource: []
}

const mapStateToProps = ({ locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
});

const mapDispatchToProps = {

};

const options = { forwardRef: true };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
)(RadioControl);
