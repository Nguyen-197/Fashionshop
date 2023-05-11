import NumbericControl from '../control-field/numberic-control';
import TextControl from '../control-field/text-control';
import PasswordControl from '../control-field/password-control'
import TextareaControl from '../control-field/textarea-control';
import { CrudFormControl } from '../entity/crud-form-control';
import { CrudFormSetting } from '../entity/crud-form-setting';
import _ from 'lodash';
import { classNames } from 'primereact/utils';
import DropDownControl from '../control-field/dropdown-control';
import DateTimeControl from '../control-field/datetime-control';
import RadioControl from '../control-field/radio-control';
import OrgSelectorControl from '../control-field/org-selector-control';
import TreeSelectorControl from '../control-field/tree-selector-control';
import FileControl from '../control-field/file-control';
import ArrayFormComponent from './array-form-component';
import InputSwitchControl from '../control-field/input-switch-control';
import MultiSelectControl from '../control-field/multi-select-control';
import ArrayFormCustomComponent from './array-form-custom-component';
import SubFromComponent from './sub-form-component';
import { useEffect } from 'react';
type IDynamicComponentProps = {
    setting: CrudFormSetting,
    updateStateField?: (fieldName: string, value: any) => void,
    formik: any,
    onChange?: (data?: any) => void
}

const DynamicComponent = (props: IDynamicComponentProps) => {
    const updateStateElement = (fieldName, value) => {
        const _temp = props.formik.values;
        _temp[fieldName] = value;
        props.formik.setValues(_temp);
        props.updateStateField && props.updateStateField(fieldName, value);
        props.onChange && props.onChange(_temp);
    }
    useEffect(() => {
       console.log("props", props);
       
    }, []);
    const renderDynamicControlField = (field: any) => {
        const defaultValue = _.get(props.formik?.values, field.field) || '';
        console.log("field.formControlType", field.formControlType);
        
        if (field.formControlType == 'textbox') {
            return <TextControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'password' && field.show == true) {
            return <PasswordControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} meter={field.meter} />
        } else if (field.formControlType == 'textarea') {
            return <TextareaControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'number') {
            return <NumbericControl {...props} objectParent={props.formik?.values} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'select') {
            return <DropDownControl {...props} objectParent={props.formik?.values} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'datetime') {
            return <DateTimeControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'radio') {
            return <RadioControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'orgSelector') {
            return <OrgSelectorControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'treeSelector') {
            return <TreeSelectorControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'file') {
            return <FileControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'inputSwitch') {
            return <InputSwitchControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'multiSelect') {
            return <MultiSelectControl {...props} {...field} fieldName={field.field} defaultValue={defaultValue} updateStateElement={updateStateElement} fieldPath={field.field} />
        } else if (field.formControlType == 'customFormControl') {
            return field.renderTempalte(field);
        } else if (field.formControlType == 'spaceFormControl') {
            return <label className="label-control">{field.customContent}</label>
        }
        return <></>
    }

    const renderDynamic = (listFields: CrudFormControl[]) => {
        return (
            <div className="row">
                {
                    listFields.map((item: CrudFormControl, idx: number) => {
                        if ((!item.checkShowControl || item.checkShowControl(item, props.formik.values, idx) && item.show)) {
                            console.log("key", item.formControlType + "_" + idx);
                            
                            if (item.formControlType == 'subForm') {
                                return <SubFromComponent key={`${item.formControlType}_${idx}`} index={idx} noNeededController={true}
                                    fieldControl={item} formik={props.formik}
                                    updateStateElement={updateStateElement} />
                            }
                            if (item.formControlType == 'arrayForm') {
                                return <ArrayFormComponent key={`${item.formControlType}_${idx}`}
                                    fieldControl={item} formik={props.formik}
                                    updateStateElement={updateStateElement} />
                            } else if (item.formControlType == 'title') {
                                return <div className={`col-12 col-md-12 text-left title-2`} key={`${item.formControlType}_${idx}`}>
                                    <label className={classNames({ 'required': item.required, 'title-control': true })}>{item.title}</label>
                                </div>
                            } else if (item.formControlType == 'arrayFormCustom') {
                                return <div key={`${item.formControlType}_${idx}`} className={`col-12 col-md-12 col-lg-${item.mdWidth} pt-3`}>
                                    <div className='row'>
                                        <div className={`col-12 col-md-12 col-lg-${item.mdWidth === 6 ? 4 : item.mdWidth === 4 ? 3 : 4} text-left`}>
                                            <label className={classNames({ 'required': item.required, 'label-control': true })}>{item.title}</label>
                                        </div>
                                        <div className={`col-12 col-md-12 col-lg-${item.mdWidth === 6 ? 8 : item.mdWidth === 4 ? 9 : 8}`}>
                                            <ArrayFormCustomComponent key={`${item.formControlType}_${idx}`}
                                                fieldControl={item} formik={props.formik} noNeededController={true}
                                                updateStateElement={updateStateElement} />
                                        </div>
                                    </div>
                                </div>
                            } else if (item.formControlType == 'spaceFormControl' && !item.customContent) {
                                return <div key={`${item.formControlType}_${idx}`} className={`col-0 col-lg-${item.mdWidth} col-md-0 pt-3`}>
                                </div>
                            }
                            return (
                                <>
                                    {
                                        item.isRow && item.show ?
                                            <div key={`${item.formControlType}_${idx}`} className={`col-12 col-lg-${item.mdWidth} col-md-${item.mdWidth === 4 ? 6 : item.mdWidth} pt-3`}>
                                                <div className='row'>
                                                    <div className={`col-12 col-lg-${item.mdWidth === 6 ? 4 : item.mdWidth === 4 ? 3 : 4} text-left`}>
                                                        <label className={classNames({ 'required': item.required, 'label-control': true })}>{item.title}</label>
                                                    </div>
                                                    <div className={`col-12 col-lg-${item.mdWidth === 6 ? 8 : item.mdWidth === 4 ? 9 : 8}`}>
                                                        {renderDynamicControlField(item)}
                                                    </div>
                                                </div>
                                            </div> : <div className={`col-lg-${item.mdWidth} col-md-${item.mdWidth}`}>
                                                <label className={classNames({ 'required': item.required, 'label-control': true })}>{item.title}</label>
                                                {renderDynamicControlField(item)}
                                            </div>

                                    }
                                </>
                            )
                        } else {
                            return <div key={`${item.formControlType}_${idx}`}></div>
                        }
                    })
                }
            </div>
        )
    }
    return (
        <>
            {props.setting && renderDynamic(props.setting.formControls)}
        </>
    )
}

export default DynamicComponent;
