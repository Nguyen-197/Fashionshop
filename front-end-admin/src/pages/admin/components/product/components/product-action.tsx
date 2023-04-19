import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom'
type IProductActionProps = StateProps & DispatchProps & {
    onAdd?: Function;
    onExportExcel?: Function
}

const ProductAction = (props: IProductActionProps) => {
    return (
        <>
            <div className="row action-control">
                <div className="col-sm-12 btn-group">
                    <Button
                        className='p-button-sm'
                        icon="pi pi-plus"
                        label={translate('product.addProduct')}
                        onClick={ () => props.onAdd && props.onAdd() }
                    />
                    {/* <Button
                        icon="pi pi-download"
                        className="p-button-sm p-button-success"
                        label={translate('product.addProductExcel')}
                        onClick={() => {props.onExportExcel && props.onExportExcel()}}
                    /> */}
                    {/* <Button
                        icon="pi pi-list"
                        className="p-button-sm p-button-warning"
                        label={translate('category.manageCategory')}
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
)(ProductAction);
