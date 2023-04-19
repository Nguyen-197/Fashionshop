
import { Button } from 'primereact/button';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import DynamicComponent from 'src/components/crud/components/dynamic-component';
import { TextFormControl, OrgSelectorFormControl, DropDownFormControl } from 'src/components/crud/entity/crud-form-control';
import { CrudFormSetting } from 'src/components/crud/entity/crud-form-setting';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { handleSearchProduct, handleUpdateFormSearch } from 'src/reducers/product.reducer';
import { translate } from 'react-jhipster';
import { BUSSINESS_OPTION } from 'src/@types/constants';
type IProductSearchProps = StateProps & DispatchProps & {
}

const ProductSearch = (props: IProductSearchProps) => {
    const setting = new CrudFormSetting({
        formControls: [
            new TextFormControl({
                mdWidth: 3,
                field: 'code',
                title: translate('product.productCode'),
                isRow: false,
            }),
            new TextFormControl({
                mdWidth: 3,
                field: 'name',
                title: translate('product.name'),
                isRow: false,
            }),
            new OrgSelectorFormControl({
                mdWidth: 3,
                field: 'idCategory',
                title: translate('product.category'),
                isRow: false,
            }),
            new DropDownFormControl({
                mdWidth: 3,
                field: 'isDelete',
                title: "Trạng thái kinh doanh",
                datasource: BUSSINESS_OPTION,
                fieldLabel: "name",
                fieldValue: "value",
                isRow: false,
            })
        ]
    })

    /**
     * Action t�m ki?m
     */
    const doSearch = (data?) => {
        props.handleSearchProduct(data);
    }

    const footer = (
        <div className="w-100 justify-content-center align-items-center btn-group pt-3">
            <Button type="submit" label={translate('common.searchLabel')} icon="pi pi-search" className="p-button-sm p-button-danger" />
            <Button label={translate('common.resetLabel')} icon="pi pi-sync" className="p-button-sm" />
        </div>
    );

    useEffect(() => {
        doSearch();
    }, []);

    /**
     * Onchange form
     */
    const onChange = (data) => {
        props.handleUpdateFormSearch(data);
    }

    let formik = CommonUtil.buildForm(setting, doSearch, {});
    return (
        <>
            <div className='panel panel-default'>
                <div className="panel-body">
                    <form onSubmit={formik.handleSubmit} >
                        <DynamicComponent formik={formik} setting={setting} onChange={onChange}/>
                        {footer}
                    </form>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
});

const mapDispatchToProps = {
    handleSearchProduct,
    handleUpdateFormSearch
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductSearch);

