import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Button } from 'primereact/button';
type IOrderReturnActionProps = StateProps & DispatchProps & {
    onAdd: Function,
    // onImportExcel: Function,
}

const OrderReturnAction = (props: IOrderReturnActionProps) => {
    return (
        <>
            <div className="row action-control">
                <div className="col-sm-12 btn-group">
                    <Button
                        className='p-button-sm'
                        icon="pi pi-plus"
                        label="Tạo đơn trả hàng"
                        onClick={() => props.onAdd && props.onAdd()}
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
)(OrderReturnAction);
