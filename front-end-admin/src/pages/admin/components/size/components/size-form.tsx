

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import DynamicComponent from 'src/components/crud/components/dynamic-component';
import { TextFormControl } from 'src/components/crud/entity/crud-form-control';
import { CrudFormSetting } from 'src/components/crud/entity/crud-form-setting';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import SizeService from 'src/services/size.services';
import { ConfirmDialog } from 'primereact/confirmdialog';

type ISizeFormProps = StateProps & DispatchProps & {
    afterSaveSuccess?: (res) => void,
    onHide?: () => void,
    sizeId?: number
}

const SizeForm = (props: ISizeFormProps) => {
    const [displayDialog, setDisplayDialog] = useState(false);
    const [title, setTitle] = useState(translate('size.titleAdd'));

    useEffect(() => {
        if (props.sizeId) {
            SizeService.findById(props.sizeId).then((res) => {
                formik.setValues(res?.data?.data);
                setTitle(translate('size.titleEdit'));
                setDisplayDialog(true);
            }).catch(() => {
                props.onHide && props.onHide();
            });
        } else {
            setTitle(translate('size.titleAdd'));
            setDisplayDialog(true);
        }

    }, []);

    const setting = new CrudFormSetting({
        formControls: [
            new TextFormControl({
                field: 'code',
                title: translate('size.code'),
                required: true,
                maxLength: 255,
            }),
            new TextFormControl({
                field: 'name',
                title: translate('size.name'),
                required: true,
                maxLength: 255,
            }),
        ]
    });

    const onSubmit = async (data) => {
        await CommonUtil.confirmSaveOrUpdate(async () => {
            await SizeService.saveOrUpdate(data).then((res) => {
                setDisplayDialog(false);
                if (props.afterSaveSuccess) {
                    props.afterSaveSuccess(res);
                }
            });
        });
    }

    let formik = CommonUtil.buildForm(setting, onSubmit, {});

    const footer = (
        <div className='text-center p-dialog-footer pt-3'>
            <Button type="submit" form="size-form" label={translate('common.saveLabel')} icon="pi pi-check" />
            <Button type="button" label={translate('common.cancelLabel')} icon="pi pi-times" className="p-button-danger" onClick={() => props.onHide && props.onHide()} />
        </div>
    );

    return (
        <>
            <Dialog header={title} visible={displayDialog} footer={footer} style={{ width: '65vw' }} onHide={() => props.onHide && props.onHide()}>
                <form id='size-form' onSubmit={formik.handleSubmit}>
                    <DynamicComponent formik={formik} setting={setting}/>
                    <Button type="submit" hidden/>
                </form>
            </Dialog>
            <ConfirmDialog />
        </>
    )
}

const mapStateToProps = ({ locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SizeForm);
