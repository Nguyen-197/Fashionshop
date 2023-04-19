
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import DynamicComponent from 'src/components/crud/components/dynamic-component';
import { TextFormControl, DatetimeFormControl } from 'src/components/crud/entity/crud-form-control';
import { CrudFormSetting } from 'src/components/crud/entity/crud-form-setting';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import {
    handleSearchSize,
    handleUpdateFormSearch
} from '../../../../../reducers/size.reducer';
import { translate } from 'react-jhipster';


type ISizeSearchProps = StateProps & DispatchProps & {
}

const SizeSearch = (props: ISizeSearchProps) => {

    const setting = new CrudFormSetting({
        formControls: [
            new TextFormControl({
                mdWidth: 3,
                field: 'code',
                title: translate('size.code'),
                maxLength: 255,
                isRow: false,
            }),
            new TextFormControl({
                mdWidth: 3,
                field: 'name',
                title: translate('size.name'),
                maxLength: 255,
                isRow: false,
            }),
        ]
    })

    /**
     * Action tìm kiếm
     */
    const doSearch = (data?) => {
        props.handleSearchSize(data);
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
    handleSearchSize,
    handleUpdateFormSearch
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SizeSearch);

