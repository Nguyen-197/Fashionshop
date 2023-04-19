
import { forwardRef, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { translate } from 'react-jhipster';
import TextControl from '../control-field/text-control';
import TextareaControl from '../control-field/textarea-control';
import NumbericControl from '../control-field/numberic-control';
import DropDownControl from '../control-field/dropdown-control';
import DateTimeControl from '../control-field/datetime-control';
import RadioControl from '../control-field/radio-control';
import OrgSelectorControl from '../control-field/org-selector-control';
import FileControl from '../control-field/file-control';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { CommonUtil } from '../../../utils/common-util';
import InputSwitchControl from '../control-field/input-switch-control';
import TreeSelectorControl from '../control-field/tree-selector-control';
import MultiSelectControl from '../control-field/multi-select-control';
import { classNames } from 'primereact/utils';

type IArrayFormComponentProps = {
    fieldControl?: any;
    index?: number;
    formik: any;
    noNeededController?: boolean;
    updateStateElement?: (fieldName: string, value: any) => void;
}
const SubFormComponent = forwardRef((props: IArrayFormComponentProps, ref) => {
    const {
        fieldControl,
        formik,
        index,
        noNeededController,
    } = props;
    const [value, setValue] = useState([{}]);
    useEffect(() => {
        setValue(_.get(formik?.values, fieldControl.field) || []);
    }, [_.get(formik?.values, fieldControl.field)]);

    const updateStateElement = (fieldName, extEditValue, idx) => {
        if (value[idx]) {
            value[idx][fieldName] = extEditValue;
            setValue(_.cloneDeep(value));
            props.updateStateElement && props.updateStateElement(fieldControl.field, value);
            // props.onChange && props.onChange(_temp);
        }
    }

    /**
     * Thêm dòng
     */
    const onAddNewRow = () => {
        value.push({ });
        setValue(_.cloneDeep(value));
    }

    const renderCell = (rowData, rowIndex, field) => {
        const idx = rowIndex;
        const defaultValue = _.get(rowData, field.field) || '';
        if (field.formControlType == 'textbox') {
            return <TextControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)} />
        } else if (field.formControlType == 'textarea') {
            return <TextareaControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)} />
        } else if (field.formControlType == 'number') {
            return <NumbericControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)} />
        } else if (field.formControlType == 'select') {
            return <DropDownControl {...props} {...field} objectParent={rowData} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)} />
        } else if (field.formControlType == 'datetime') {
            return <DateTimeControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)} />
        } else if (field.formControlType == 'radio') {
            return <RadioControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)} />
        } else if (field.formControlType == 'orgSelector') {
            return <OrgSelectorControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)} />
        } else if (field.formControlType == 'treeSelector') {
            return <TreeSelectorControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)}/>
        } else if (field.formControlType == 'file') {
            return <FileControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)} />
        } else if (field.formControlType == 'inputSwitch') {
            return <InputSwitchControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)} />
        } else if (field.formControlType == 'multiSelect') {
            return <MultiSelectControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
                updateStateElement={(fieldName, extEditValue) => updateStateElement(fieldName, extEditValue, idx)} />
        } else if (field.formControlType == 'customFormControl') {
            return field.renderTempalte(field);
        } else if (field.formControlType == 'title') {
            if (field.customContent) {
                const customContent = typeof field.customContent == "function" ? field.customContent(idx): field.customContent;
                return <div key={`field_${idx}`} className='row'>
                    <div className={`col-6 text-left mt-1 col-md-3`}>
                        <Button type="button" tooltip={translate('common.deleteLabel')}
                            icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger p-button-plain" onClick={() => onDeleteRow(rowData, rowIndex)} />
                        {/* <label className={classNames({ 'required': field.required, 'title-control': true })}>{field.title}</label> */}
                    </div>
                    <div className={`col-6 col-md-9 mt-3`}>
                        {customContent}
                    </div>
                </div>
            }
            return <div key={`field_${idx}`} className='row'>
                <div className={`col-12 text-left mt-3`}>
                    <label className={classNames({ 'required': field.required, 'title-control': true })}>{field.title}</label>
                </div>
            </div>
        }
        return <></>
    }
    const onDeleteRow = (rowData, rowIndex) => {
        value.splice(rowIndex, 1);
        setValue(_.cloneDeep(value));
    }
    const templateHeader = (options) => {
        const toggleIcon = options.collapsed ? 'pi pi-angle-down' : 'pi pi-angle-up';
        const tooltip = options.collapsed ? translate('common.expand') : translate('common.collapsed');
        return (

            <div className='text-right'>
                <Button type="button" icon={toggleIcon} className="p-button-rounded p-button-text p-button-plain mr-5 ml-5" onClick={options.onTogglerClick} tooltip={tooltip} />
            </div>
        )
    }
    return (
        <>
            {!noNeededController ? <> {value.map((item, index) => {
                return <div key={index}>
                        {fieldControl.formControls.map((col, idx) => {
                            return <div className={`col-12 col-md-12`} key={idx}>
                                <div className='row'>
                                    <div className={`col-12 col-md-3 text-left`}>
                                        <label className={classNames({ 'required': col.required, 'label-control': true })}>{col.title}</label>
                                    </div>
                                    <div className='col-12 col-md-9 pb-3'>
                                        {renderCell(item, index, col)}
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                })}
                <div className='text-center pt-2'>
                    <Button type="button" icon="pi pi-plus" label={translate("common.addLabel")} onClick={onAddNewRow} className="add-button evn-button-primary"/>
                </div>
            </> : <>
                {value.map((item, index) => {
                    return <div key={index} className="w-100">
                        <Panel toggleable headerTemplate={templateHeader} className="panel-sub-form mb-1">
                            <div className='row' style={{padding: "15px 0px", margin: "0px"}}>
                            {fieldControl.formControls.map((col, idx) => {
                                    return <div key={idx} className={`col-12 col-md-4`}>
                                        <div className='row'>
                                            <div className={`col-12 col-lg-3 text-left`}>
                                                <label className={classNames({ 'required': col.required, 'label-control': true })}>{col.title}</label>
                                            </div>
                                            <div className='col-12 col-lg-9 pb-3'>
                                                {renderCell(item, index, col)}
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </Panel>
                    </div>
                    })}
            </>}
        </>
    )
});


export default SubFormComponent;
