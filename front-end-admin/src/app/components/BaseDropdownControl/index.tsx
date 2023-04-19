import { forwardRef, useState, useEffect, useMemo } from 'react';
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/reducers';
import { IControlProps } from 'src/@types/interfaces/control-props';
import { CommonUtil } from 'src/utils/common-util';
import ErrorMessage from 'src/components/error/ErrorMessage';
import { Dropdown, DropdownChangeParams, DropdownProps } from 'primereact/dropdown';
import { store } from 'src';
import { handleUpdateDatasource } from 'src/reducers/authentication';
import { RESPONSE_TYPE } from 'src/enum';
import _ from 'lodash';
type IDropdownControlProps = StateProps & DispatchProps & DropdownProps & IControlProps & {
    path?: string;
    optionPrefixLabel?: string;
    showLabel?: boolean;
}

const DropdownControl = forwardRef((props: IDropdownControlProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const [datasource, setDatasource] = useState(props.options || []);
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, showLabel, baseServices,
        optionPrefixLabel, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return CommonUtil.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useEffect(() => {
        const newValue = props.initialValue || '';
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    }, [props.initialValue]);

    useEffect(() => {
        const fetchDatasource = async () => {
            if (!props.baseServices) {
                setDatasource(props.options || []);
                return;
            }
            const key = `${props.baseServices.constructor.name}_${props.groupCode}`;
            const { datasource } = store.getState().authentication;
            if (datasource.get(key)) {
                return datasource.get(key) || [];
            } else {
                if (props.groupCode || props.path) {
                    const resultData = await props.baseServices.filterByGroupCode(props.groupCode, props.path);
                    if (resultData.data.type == RESPONSE_TYPE.SUCCESS) {
                        setDatasource(resultData.data.data);
                        store.dispatch(handleUpdateDatasource(key, resultData.data.data));
                    } else {
                        setDatasource([]);
                        store.dispatch(handleUpdateDatasource(key, resultData.data.data));
                    }
                } else {
                    const resultData = await props.baseServices.findAll();
                    if (resultData.data.type == RESPONSE_TYPE.SUCCESS && resultData.data?.data) {
                        setDatasource(resultData.data.data);
                        store.dispatch(handleUpdateDatasource(key, resultData.data.data));
                    } else {
                        setDatasource([]);
                        store.dispatch(handleUpdateDatasource(key, resultData.data.data));
                    }
                }
            }
        }
        fetchDatasource()
    }, [props?.options, props?.baseServices]);

    // useEffect(() => {
    //     props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, value);
    // }, [value]);

    const onChange = (event: DropdownChangeParams) => {
        const newValue = event.value;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, event, newValue);
    };

    const optionTemplate = (option: any) => {
        const _temp = [];
        props.optionLabel && _temp.push(option[props.optionLabel]);
        props.optionPrefixLabel && _temp.push(option[props.optionPrefixLabel]);
        return (
            <div className="flex">
                <span>{_temp.join(" - ")}</span>
            </div>
        );
    }

return (
    <>
        {props.labelKey && props.showLabel ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{props.labelKey}</label> : ''}
        <div className='form-control-wrap'>
            <Dropdown
                {...restProps}
                showFilterClear
                showClear
                filter
                id={controlId}
                name={props.property}
                value={value}
                className={`w-100${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                options={datasource}
                onChange={onChange}
                itemTemplate={optionTemplate}
            />
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
    </>
    );
})
DropdownControl.displayName = 'DropdownControl';
DropdownControl.defaultProps = {
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
)(DropdownControl);