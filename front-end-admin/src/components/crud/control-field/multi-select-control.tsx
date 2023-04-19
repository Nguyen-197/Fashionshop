
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { FieldStyleClass } from './field-style-class';
import { translate } from 'react-jhipster';
import { store } from 'src';
import { handleUpdateDatasource } from '../../../reducers/authentication';
import { CommonUtil } from '../../../utils/common-util';
import { useDependency } from '../../../utils/useDependency';
import { MultiSelect } from 'primereact/multiselect';
import { connect, Options } from 'react-redux';
import { IRootState } from '../../../reducers';

type IMultiSelectControlProps = IFieldProps & StateProps & DispatchProps & {
    isMultiLanguage?: boolean;
}
// https://formik.org/docs/examples/dependent-fields
const MultiSelectControl = forwardRef((props: IMultiSelectControlProps, ref) => {
    const textboxRef = useRef(null);
    const [value, setValue] = useState(props.defaultValue || null);
    const [datasource, setDatasource] = useState(props.datasource || []);
    const [optionLabel, setOptionLabel] = useState(props.fieldLabel || 'text');
    const [isChangeDependency] = useDependency(props.dependencies, props.formik.values);
    const [oldFilters, setOldFilters] = useState(null);

    const getStyleClass = (attr: string) => {
        return _.get(FieldStyleClass, attr)
    }

    useEffect(() => {
        const reloadDatasource = async () => {
            if (props.modifyFilter && isChangeDependency !== null) {
                const temp = { filters: [] as Array<any>, order: {} as Object };
                const filters = Object.assign(temp, props.defaultFilter);
                await props.modifyFilter(filters)
                loadDatasource(filters);
            }
        }
        reloadDatasource().catch(console.error);
    }, [isChangeDependency])

    useEffect(() => {
        const fetchData = async () => {
            if (props.baseService) {
                await loadDatasource(props.defaultFilter);
            } else {
                setOptionLabel(props.fieldLabel);
            }
        }
        fetchData().catch(console.error);
    }, []);

    useEffect(() => {
        // setFieldValue(props.fieldName, value);
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        props.updateStateElement(props.fieldName, value);
    }, [value]);

    useEffect(() => {
        if (props.isFocus && textboxRef && textboxRef.current) {
            textboxRef.current.focus();
        }
    }, [props.isFocus]);

    const loadDatasource = async (filters) => {
        if (_.isEqual(oldFilters, filters)) {
            return;
        }
        setOldFilters(filters);
        setOptionLabel('text');
        const key = `${props.baseService.constructor.name}_${props.groupCode}`;
        const { datasource } = store.getState().authentication;
        if (datasource.get(key)) {
            setDatasource(datasource.get(key));
        } else {
            if (props.groupCode) {
                const res = await props.baseService.filterByGroupCode(props.groupCode);
                setDatasource(res.data?.rows?.map(e => {
                    e['text'] = props.renderLabel ? props.renderLabel(e) : e[props.fieldLabel];
                    return e;
                }));
                store.dispatch(handleUpdateDatasource(key, res.data.rows));
            } else {
                const searchCondition = filters ? CommonUtil.buildSearchCondition(filters) : { limit: Number.MAX_SAFE_INTEGER };
                let select = [props.fieldLabel, props.fieldValue];
                if (props.extraField) {
                    select = [...select, ...props.extraField];
                }
                searchCondition['select'] = select.join(',');
                const res = await props.baseService.getDataDropdownByFilter(searchCondition);
                setDatasource(res.data?.map(e => {
                    e['text'] = props.renderLabel ? props.renderLabel(e) : e[props.fieldLabel];
                    return e;
                }));
                // store.dispatch(handleUpdateDatasource(key, res.data));
            }
        }
    }
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
    const datasourceRender = useMemo(() => {
        if (props.isMultiLanguage) {
            const _datasource = _.cloneDeep(datasource);
            return _datasource.map(e => {
                e[optionLabel] = translate(e[optionLabel]);
                return e;
            });
        }
        return datasource;
    }, [datasource])
    return (
        <>
            <div>
                <MultiSelect value={value}
                    options={datasourceRender}
                    onChange={onChange}
                    optionLabel={optionLabel}
                    optionValue={props.fieldValue}
                    filter
                    showClear
                    filterBy={props.fieldLabel}
                    className={`${getStyleClass('multiSelect')} ${props.disabled ? 'disable' : ''} ${isFormFieldValid(props.fieldPath) ? 'p-invalid' : ''}`}
                    placeholder={placeholder}
                    emptyFilterMessage={translate('common.dataNotFound')}
                    selectedItemsLabel={translate('common.selectedItemsLabel')}
                    // display="chip"
                    maxSelectedLabels={3}
                />
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
    )
});

MultiSelectControl.defaultProps = {
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
)(MultiSelectControl);
