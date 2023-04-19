
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { CrudFormSetting } from 'src/components/crud/entity/crud-form-setting';
import { TextFormControl, TextAreaFormControl, OrgSelectorFormControl } from 'src/components/crud/entity/crud-form-control';
import CategoryService from 'src/services/category.services';
import { CommonUtil } from 'src/utils/common-util';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import DynamicComponent from 'src/components/crud/components/dynamic-component';
import { translate } from 'react-jhipster';
import { RESPONSE_CODE, RESPONSE_TYPE } from 'src/enum';
type ICategoryFormProps = StateProps & DispatchProps & {
    categoryId?: number,
    afterSaveSuccess?: (res) => void,
    onHide: () => void,
}

const CategoryForm = (props: ICategoryFormProps) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const [title, setTitle] = useState('Thêm mới danh mục');
    const [formData, setFormData] = useState({});

    const setting = new CrudFormSetting({
        formControls: [
            new TextFormControl({
                field: 'code',
                title: translate('category.categoryCode'),
                required: true,
                maxLength: 50,
                isFocus: true,
                mdWidth: 6
            }),
            new TextFormControl({
                field: 'name',
                title: translate('category.name'),
                required: true,
                maxLength: 200,
                mdWidth: 6
            }),
            new OrgSelectorFormControl({
                field: 'parentId',
                title: translate('category.categoryParent'),
                // required: true,
                mdWidth: 6
            }),
            new TextAreaFormControl({
                field: 'description',
                title: translate('category.description'),
                mdWidth: 6,
                maxLength: 2000
            })
        ]
    });
    const onSubmit = async (data) => {
        setFormData(data);
        await CommonUtil.confirmSaveOrUpdate(async () => {
            await CategoryService.saveOrUpdate(data).then((res) => {
                // if (res.data.type == RESPONSE_TYPE.)
                setDisplayBasic(false);
                if (props.afterSaveSuccess) {
                    props.afterSaveSuccess(res);
                }
            }).catch(error => {
                const { data } = error.response;
                if (data.code == RESPONSE_CODE.ERROR_VALIDATE) {
                    const fields = data.data
                    formik.setErrors(CommonUtil.convertDataError(fields));
                } else if (data.code == RESPONSE_CODE.DUPLICATE_CODE) {
                    console.log(">> data: ", data);
                }
            });
        });
    }

    let formik = CommonUtil.buildForm(setting, onSubmit, { id: props?.categoryId });

    useEffect(() => {
        if (props.categoryId) {
            CategoryService.findById(props.categoryId).then((res) => {
                formik.setValues(res?.data?.data);
                setTitle('Cập nhật danh mục');
                setDisplayBasic(true);
            }).catch(() => {
                props.onHide && props.onHide();
            });
        } else {
            setTitle('Thêm mới danh mục');
            setDisplayBasic(true);
        }
    }, []);

    const footer = (
        <div className='text-center p-dialog-footer pt-3'>
            <Button type="submit" label={translate('common.saveLabel')} icon="pi pi-check" />
            <Button type="button" label={translate('common.cancelLabel')} icon="pi pi-times" className='p-button-danger' onClick={() => props.onHide()}/>
        </div>
    );

    return (
        <>
            <Dialog header={title} visible={displayBasic} style={{ width: '65vw' }} onHide={() => props.onHide()}>
                <Formik initialValues={formik.values} onSubmit={formik.handleSubmit}>
                    <form onSubmit={formik.handleSubmit} >
                        <DynamicComponent formik={formik} setting={setting}/>
                        {footer}
                    </form>
                </Formik>
            </Dialog>
        </>
    )
}

const mapStateToProps = ({ }: IRootState) => ({

});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
    // @ts-ignore
)(CategoryForm);
