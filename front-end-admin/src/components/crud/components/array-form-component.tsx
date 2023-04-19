
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
import FileCustomControl from '../control-field/file-custom-control';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { CommonUtil } from '../../../utils/common-util';
import InputSwitchControl from '../control-field/input-switch-control';
import TreeSelectorControl from '../control-field/tree-selector-control';
import MultiSelectControl from '../control-field/multi-select-control';

type IArrayFormComponentProps = {
    fieldControl?: any;
    formik: any;
    updateStateElement?: (fieldName: string, value: any) => void;
}
const ArrayFormComponent = forwardRef((props: IArrayFormComponentProps, ref) => {
    const {
        fieldControl,
        formik
    } = props;
    const [value, setValue] = useState([]);

    useEffect(() => {
        setValue(_.get(formik?.values, fieldControl.field) || []);
    }, []);

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

    /**
     * Xóa dòng
     * @param rowData
     */
    const onDeleteRow = (rowData, extValue) => {
        value.splice(extValue.rowIndex, 1);
        setValue(_.cloneDeep(value));
    }

    const renderCell = (rowData, extValue, field) => {
        const idx = extValue.rowIndex;
        const defaultValue = _.get(rowData, field.field) || '';
        if (!field.checkShowControl || field.checkShowControl(field, formik.values, idx)) {
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
            } else if (field.formControlType == 'fileCustom') {
                return <FileCustomControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} fieldPath={`${fieldControl.field}[${idx}].${field.field}`}
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
    }
    const dynamicColumns = fieldControl.formControls.map((col, idx) => {
        const styles = {};
        styles['width'] = col.width;
        return (
            <Column key={idx}
                field={col.field}
                body={(rowData, extValue) => renderCell(rowData, extValue, col)}
                header={col.title}
                style={styles}
                className={`text-${col.textAlign}`}
            />
        );
    });

    const templateHeader = (options) => {
        const toggleIcon = options.collapsed ? 'pi pi-plus' : 'pi pi-minus';
        const className = `${options.className} `;
        const titleClassName = `${options.titleClassName} pl-1`;
        const tooltip = options.collapsed ? translate('common.expand') : translate('common.collapsed');
        return (
            <div className={className}>
                <span className={titleClassName}>
                    {fieldControl.title}
                </span>
                <div>
                    <Button type="button" label={translate('common.addLabel')} icon="pi pi-plus" className="p-button-sm" onClick={onAddNewRow} />
                    <Button type="button" icon={toggleIcon} className="p-button-rounded p-button-text p-button-plain ml-2" onClick={options.onTogglerClick} tooltip={tooltip} />
                </div>
            </div>
        )
    }

    const renderSTT = (rowData, x) => {
        return <>{x.rowIndex + 1}</>
    }

    const renderActionColumn = (rowData, extValue) => {
        return (<div className='text-center'>
            <Button type="button" tooltip={translate('common.deleteLabel')}
                icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger p-button-plain" onClick={() => onDeleteRow(rowData, extValue)} />
        </div>);
    }

    return (
        <>
            <div className={`col-12 col-md-${fieldControl.mdWidth} pt-3`}>
                <Panel headerTemplate={templateHeader} toggleable>
                    <DataTable value={value} responsiveLayout="scroll" stripedRows showGridlines
                        emptyMessage={translate('common.dataNotFound')}>
                        <Column header={translate('common.rowNum')} body={renderSTT} style={{ width: '50px' }} bodyClassName="text-center"></Column>
                        {dynamicColumns}
                        <Column header={translate('common.actionLabel')} body={renderActionColumn} style={{ width: '50px' }}></Column>
                    </DataTable>
                </Panel>
            </div>
        </>
    )
});


export default ArrayFormComponent;
