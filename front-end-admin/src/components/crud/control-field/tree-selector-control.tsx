
import { forwardRef, useEffect, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import TreeSelectorDiablog from './partents/tree-selector-dialog';
import TreeSelectorService from '../../../services/tree-selector.services';

type ITreeSelectorControlProps = IFieldProps & {
    dateFormat?: string;
    showTime?: boolean;
    hourFormat?: string;
    view?: string;
    monthNavigator?: boolean;
    yearNavigator?: boolean;
    title?: string;
    treeSelectorOptions: any;
}
// https://formik.org/docs/examples/dependent-fields , 'YYYY-MM-DDTHH:MM:ss.SSSZ'
const TreeSelectorControl = forwardRef((props: ITreeSelectorControlProps, ref) => {
    const [value, setValue] = useState(props.defaultValue);
    const [orgName, setOrgName] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        props.updateStateElement(props.fieldName, value ? value : null);
    }, [value]);

    const onSelected = (event) => {
        setShowDialog(false);
        setOrgName(event[props.treeSelectorOptions.nameField]);
        setValue(event.id);
    }

    const onCancel = () => {
        setOrgName('');
        setValue(null);
    }

    useEffect(() => {
        if (props.defaultValue) {
            TreeSelectorService.findTreeSelectorById(props.defaultValue, props.treeSelectorOptions).then(res => {
                if (res.data) {
                    setOrgName(res.data[props.treeSelectorOptions.nameField]);
                    setValue(res.data.id);
                }
            });
        }
    }, [])

    const isFormFieldValid = (name) => {
        const _touched = _.get(props?.formik?.touched, name);
        return !!(_touched && props?.formik?.errors[name])
    };

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{props?.formik?.errors[name]}</small>;
    };

    return (
        <>
            <div className="category-selector">
                <div className="p-inputgroup">
                    {/* <InputText placeholder="Keyword"/> */}
                    <div className="p-inputtext category-name" onClick={() => setShowDialog(true)}>
                        {orgName}
                    </div>
                    <Button type="button" icon="pi pi-check" className="p-button-info" title={"Chọn " + props.title} onClick={() => setShowDialog(true)}/>
                    <Button type="button" icon="pi pi-times" className="p-button-danger" title="Hủy chọn" onClick={onCancel}/>
                </div>
                {getFormErrorMessage(props.fieldPath)}
            </div>
            <Dialog header={"Chọn " + props.title} visible={showDialog} style={{ width: '70vw', height: '70vh' }} onHide={() => setShowDialog(false)}>
                <TreeSelectorDiablog onSelected={onSelected} treeSelectorOptions={props.treeSelectorOptions}/>
            </Dialog>
        </>
    )
});

TreeSelectorControl.defaultProps = {
}

export default TreeSelectorControl;
