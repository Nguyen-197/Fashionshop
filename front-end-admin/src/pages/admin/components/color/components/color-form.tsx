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
import ColorService from 'src/services/color.services';

type IColorFormProps = StateProps & DispatchProps & {
    afterSaveSuccess?: (res) => void,
    onHide?: () => void,
    colorId?: number
}

const ColorForm = (props: IColorFormProps) => {
    const [displayDialog, setDisplayDialog] = useState(false);
    const [title, setTitle] = useState(translate('color.titleAdd'));

    useEffect(() => {
        if (props.colorId) {
            ColorService.findById(props.colorId).then((res) => {
                formik.setValues(res?.data?.data);
                setTitle(translate('color.titleEdit'));
                setDisplayDialog(true);
            }).catch(() => {
                props.onHide && props.onHide();
            });
        } else {
            setTitle(translate('color.titleAdd'));
            setDisplayDialog(true);
        }

    }, []);

    const setting = new CrudFormSetting({
        formControls: [
            new TextFormControl({
                field: 'code',
                title: translate('color.code'),
                required: true,
                maxLength: 255,
            }),
            new TextFormControl({
                field: 'name',
                title: translate('color.name'),
                required: true,
                maxLength: 255,
            }),
        ]
    });

    const onSubmit = (data) => {
        CommonUtil.confirmSaveOrUpdate(() => {
            ColorService.saveOrUpdate(data).then((res) => {
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
            <Button type="submit" label={translate('common.saveLabel')} icon="pi pi-check" onClick={() => formik.handleSubmit()}/>
            <Button type="button" label={translate('common.cancelLabel')} icon="pi pi-times" className="p-button-danger" onClick={() => props.onHide && props.onHide()} />
        </div>
    );

    return (
        <>
            <Dialog header={title} visible={displayDialog} footer={footer} style={{ width: '65vw' }} onHide={() => props.onHide && props.onHide()}>
                <form onSubmit={formik.handleSubmit} >
                    <DynamicComponent formik={formik} setting={setting}/>
                    <Button type="submit" hidden />
                </form>
            </Dialog>
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
)(ColorForm);
