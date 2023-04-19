
import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { connect } from 'react-redux';
import DynamicComponent from 'src/components/crud/components/dynamic-component';
import { TextFormControl, OrgSelectorFormControl } from 'src/components/crud/entity/crud-form-control';
import { CrudFormSetting } from 'src/components/crud/entity/crud-form-setting';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { handleSearchCategories, handleUpdateFormSearch } from 'src/reducers/category.reducer';
import { translate } from 'react-jhipster';
type ICategorySearchProps = StateProps & DispatchProps & {
}

const CategorySearch = (props: ICategorySearchProps) => {
    const setting = new CrudFormSetting({
        formControls: [
            new TextFormControl({
                mdWidth: 3,
                field: 'code',
                title: translate('category.categoryCode'),
                isRow: false,
            }),
            new TextFormControl({
                mdWidth: 3,
                field: 'name',
                title: translate('category.name'),
                isRow: false,
            }),
            new OrgSelectorFormControl({
                mdWidth: 3,
                field: 'parentId',
                title: translate('category.categoryParent'),
                isRow: false,
            })
        ]
    })

    /**
     * Action t�m ki?m
     */
    const doSearch = (data?) => {
        props.handleSearchCategories(data);
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
    handleSearchCategories,
    handleUpdateFormSearch
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategorySearch);

