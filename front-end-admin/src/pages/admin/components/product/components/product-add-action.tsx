import React, { useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom'
type IProductAddActionProps = StateProps & DispatchProps & {
    onImportExcel: Function,
}

const ProductAddAction = (props: IProductAddActionProps) => {
    const history = useHistory();
    const onRedirectManageProduct = () => {
        history.push("/admin/products")
    }
    const onRedirectManageCategory = () => {
        history.push("/admin/category")
    }
    return (
        <>
            <div className="row action-control">
                <div className="col-sm-12 btn-group">
                    <Button
                        className='p-button-sm'
                        icon="pi pi-plus"
                        label={translate('product.manageProduct')}
                        onClick={() => onRedirectManageProduct()}
                    />
                    <Button
                        icon="pi pi-list"
                        className="p-button-sm p-button-warning"
                        label={translate('category.manageCategory')}
                        onClick={() => onRedirectManageCategory()}
                    />
                    <Button
                        icon="pi pi-download"
                        className="p-button-sm p-button-success"
                        label={translate('product.addProductExcel')}
                        onClick={() => props.onImportExcel()}
                    />
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
)(ProductAddAction);
