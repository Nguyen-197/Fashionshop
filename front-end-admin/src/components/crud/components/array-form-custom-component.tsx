
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

type IArrayFormComponentProps = {
    fieldControl?: any;
    formik: any;
    noNeededController?: boolean;
    updateStateElement?: (fieldName: string, value: any) => void;
}
const ArrayFormCustomComponent = forwardRef((props: IArrayFormComponentProps, ref) => {
    const {
        fieldControl,
        formik,
        noNeededController
    } = props;
    const [value, setValue] = useState(_.get(formik?.values, fieldControl.field) || [{}]);

    useEffect(() => {
        setValue(_.get(formik?.values, fieldControl.field) || [{}]);
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
            return <DropDownControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
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
        }
        return <></>
    }
    const onDeleteRow = (rowData, index) => {
        value.splice(index, 1);
        setValue(_.cloneDeep(value));
    }
    return (
        <>
            {!noNeededController ? <div className={`col-12 col-md-12`} style={{padding: "0px"}}>
                {value.map((item, index) => {
                    return <div key={index} className='row'>
                        {fieldControl.formControls.map((col, idx) => {
                            return <div className='col-5 col-md-5 pb-3' key={idx}>
                                {renderCell(item, index, col)}
                            </div>
                        })}
                        <div className='col-2 col-md-2 pb-3'>
                            <Button disabled={value.length == 1} type="button" icon="pi pi-times" label="" style={{}} onClick={() => onDeleteRow(item, index)} className="delete-button mt-1"/>
                        </div>
                    </div>
                })}
                <Button type="button" icon="pi pi-plus" label={translate("common.add")} onClick={onAddNewRow} className="add-button evn-button-primary"/>
            </div> : <div className={`col-12 col-md-12`} style={{padding: "0px"}}>
                {value.map((item, index) => {
                    return <div key={index} className='row'>
                        {fieldControl.formControls.map((col, idx) => {
                            return <div className='col-6 col-md-6 pb-3' key={idx}>
                                {renderCell(item, index, col)}
                            </div>
                        })}
                    </div>
                })}
            </div> }

        </>
    )
});


export default ArrayFormCustomComponent;
