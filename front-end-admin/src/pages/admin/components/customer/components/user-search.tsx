
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import DynamicComponent from 'src/components/crud/components/dynamic-component';
import { TextFormControl, DropDownFormControl } from 'src/components/crud/entity/crud-form-control';
import { CrudFormSetting } from 'src/components/crud/entity/crud-form-setting';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { handleSearchUser, handleUpdateFormSearch } from 'src/reducers/customer.reducer';
import { translate } from 'react-jhipster';
import UserService from 'src/services/user.services';
type IUserSearchProps = StateProps & DispatchProps & {
}

const UserSearch = (props: IUserSearchProps) => {
    const setting = new CrudFormSetting({
        formControls: [
            new TextFormControl({
                field: 'fullName',
                title: 'Họ và tên',
                isRow: false,
                mdWidth: 3
            }),
            new TextFormControl({
                field: 'email',
                title: 'Email',
                isRow: false,
                mdWidth: 3
            }),
            new TextFormControl({
                field: 'phoneNumber',
                title: 'Số điện thoại',
                isRow: false,
                mdWidth: 3
            }),
        ]
    })

    /**
     * Action t�m ki?m
     */
    const doSearch = (data?) => {
        props.handleSearchUser(data);
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
                        <DynamicComponent formik={formik} setting={setting} onChange={onChange} />
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
    handleSearchUser,
    handleUpdateFormSearch
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSearch);

