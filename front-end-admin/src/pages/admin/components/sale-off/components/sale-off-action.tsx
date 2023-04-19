import { useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import UserService from 'src/services/user.services';
import { Button } from 'primereact/button';
type ISaleOffActionProps = StateProps & DispatchProps & {
    onAdd: Function,
}

const SaleOffAction = (props: ISaleOffActionProps) => {
    return (
        <>
            <div className="row action-control">
                <div className="col-sm-12 btn-group">
                    {
                        props.isAdmin &&
                            <Button
                            className='p-button-sm'
                            icon="pi pi-plus"
                            label="Tạo khuyến mại"
                            onClick={() => props.onAdd && props.onAdd()}
                        />
                    }
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale, authentication }: IRootState) => ({
    currentLocale: locale.currentLocale,
    isAdmin: authentication.isAdmin
});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(SaleOffAction);
