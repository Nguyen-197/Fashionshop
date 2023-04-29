
import { forwardRef, useEffect, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { FieldStyleClass } from './field-style-class';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import OrgSelectorDiablog from './partents/org-selector-dialog';
import OrganizationService from '../../../services/organization.services';
import { Toast } from 'src/components/toast/toast.utils';
import { translate } from 'react-jhipster';
import { RESPONSE_TYPE } from '../../../enum';
type IOrgSelectorControlProps = IFieldProps & {
    dateFormat?: string;
    showTime?: boolean;
    hourFormat?: string;
    view?: string;
    monthNavigator?: boolean;
    yearNavigator?: boolean;
}
// https://formik.org/docs/examples/dependent-fields , 'YYYY-MM-DDTHH:MM:ss.SSSZ'
const OrgSelectorControl = forwardRef((props: IOrgSelectorControlProps, ref) => {
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
        // if(!event.parentId) {
            setShowDialog(false);
            setOrgName(event.name);
            setValue(event.id);
        // } else {
        //     Toast.error("Danh mục chỉ có tối đa 2 cấp");
        // }
    }

    const onCancel = () => {
        setOrgName('');
        setValue(null);
    }

    useEffect(() => {
        if (props.defaultValue) {
            OrganizationService.findById(props.defaultValue).then(res => {
                if (res.data.type == RESPONSE_TYPE.SUCCESS) {
                    setOrgName(res.data.data.name);
                    setValue(res.data.data.id);
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
                    <Button type="button" icon="pi pi-check" className="p-button-info" data-tip="Chọn đơn vị" onClick={() => setShowDialog(true)}/>
                    <Button type="button" icon="pi pi-times" className="p-button-danger" data-tip="Hủy chọn" onClick={onCancel}/>
                </div>
                {getFormErrorMessage(props.fieldPath)}
            </div>
            <Dialog header={translate('orgSelector.title')} visible={showDialog} style={{ width: '70vw', height: '70vh' }} onHide={() => setShowDialog(false)}>
                <OrgSelectorDiablog onSelected={onSelected}/>
            </Dialog>
        </>
    )
});

OrgSelectorControl.defaultProps = {
}

export default OrgSelectorControl;
