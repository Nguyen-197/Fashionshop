import { useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import UserService from 'src/services/user.services';
import { Button } from 'primereact/button';
type IUserActionProps = StateProps & DispatchProps & {
    onAdd: Function,
    // onImportExcel: Function,
}

const UserAction = (props: IUserActionProps) => {
    return (
        <>
            <div className="row action-control">
                <div className="col-sm-12 btn-group">
                    <Button
                        className='p-button-sm'
                        icon="pi pi-plus"
                        label="Thêm khách hàng"
                        onClick={() => props.onAdd && props.onAdd()}
                    />
                    {/* <Button
                        icon="pi pi-download"
                        className="p-button-sm p-button-success"
                        label={translate('category.addCategoryExcel')}
                    // onClick={() => props.onImportExcel()}
                    /> */}
                    {/* <Button
                        icon="pi pi-list"
                        className="p-button-sm p-button-warning"
                        label="Quản lí nhóm khách hàng"
                    /> */}
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale }: IRootState) => ({
    currentLocale: locale.currentLocale
});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAction);
