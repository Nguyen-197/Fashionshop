
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { FieldStyleClass } from './field-style-class';
import { Dropdown } from 'primereact/dropdown';
import { translate } from 'react-jhipster';
import { store } from 'src';
import { handleUpdateDatasource } from '../../../reducers/authentication';
import { connect, Options } from 'react-redux';
import { IRootState } from '../../../reducers';

type IDropDownControlProps = IFieldProps & StateProps & DispatchProps & {
    isMultiLanguage?: boolean;
    objectParent?: any;
}
// https://formik.org/docs/examples/dependent-fields
const DropDownControl = forwardRef((props: IDropDownControlProps) => {
    const textboxRef = useRef(null);
    const [optionLabel, setOptionLabel] = useState(props.fieldLabel || 'text');
    const [value, setValue] = useState(props.defaultValue || null);
    const [datasource, setDatasource] = useState(props.datasource || []);

    const getStyleClass = (attr: string) => {
        return _.get(FieldStyleClass, attr)
    }

    useEffect(() => {
        const fetchData = async () => {
            if (props.baseService) {
                const key = `${props.baseService.constructor.name}_${props.groupCode}`;
                const { datasource } = store.getState().authentication;
                if (datasource.get(key)) {
                    setDatasource(datasource.get(key));
                    if (props.selectedFirst) {
                        setValue(datasource[0]);
                    }
                } else {
                    setOptionLabel(props.fieldLabel);
                    if (props.groupCode) {
                        const res = await props.baseService.filterByGroupCode(props.groupCode);
                        setDatasource(res.data.data);
                        if (props.selectedFirst) {
                            setValue(datasource[0]);
                        }
                        store.dispatch(handleUpdateDatasource(key, res.data.data));
                    } else {
                        const res = await props.baseService.findAll();
                        setDatasource(res.data.data);
                        if (props.selectedFirst) {
                            setValue(datasource[0]);
                        }
                        store.dispatch(handleUpdateDatasource(key, res.data.data));
                    }
                }
            }
        }
        fetchData().catch(console.error);
    }, []);

    useEffect(() => {
        // setFieldValue(props.fieldName, value);
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        const objectPlain = datasourceRender?.find(e => e[props.fieldValue] == value)
        props.callbackValueChange && props.callbackValueChange(value, objectPlain);
        props.updateStateElement(props.fieldName, value);
    }, [value]);

    useEffect(() => {
        if (props.selectedFirst) {
            setValue(datasource[0].id);
            props.updateStateElement(props.fieldName, value);
        }
    }, [props.selectedFirst])

    const datasourceRender = useMemo(() => {
        if (props.isMultiLanguage) {
            const _datasource = _.cloneDeep(datasource);
            return _datasource.map(e => {
                e[optionLabel] = translate(e[optionLabel]);
                return e;
            });
        }
        return datasource;
    }, [datasource, props.currentLocale])

    useEffect(() => {
        if (props.isFocus && textboxRef && textboxRef.current) {
            textboxRef.current.focus();
        }
    }, [props.isFocus]);

    const onChange = (e) => {
        setValue(e.value)
    }
    const isFormFieldValid = (name) => {
        const _touched = _.get(props?.formik?.touched, name);
        return !!(_touched && props?.formik?.errors[name])
    };
    // const isFormFieldValid = (name) => !!(props?.formik?.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{props?.formik?.errors[name]}</small>;
    };
    const placeholder = props.isSearchForm ? translate('common.selectAll') : (props.required ? translate('common.mustSelect') : translate('common.select'))
    return (
        <>
            <div>
                <Dropdown value={value}
                    options={datasource}
                    onChange={onChange}
                    optionLabel={optionLabel}
                    optionValue={props.fieldValue}
                    filter
                    showClear
                    filterBy={optionLabel}
                    className={`${getStyleClass('dropdown')} ${props.disabled ? 'disable' : ''} ${isFormFieldValid(props.fieldPath) ? 'p-invalid' : ''}`}
                    placeholder={placeholder}
                />
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
    )
});


DropDownControl.defaultProps = {
    isMultiLanguage: false
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
)(DropDownControl);
