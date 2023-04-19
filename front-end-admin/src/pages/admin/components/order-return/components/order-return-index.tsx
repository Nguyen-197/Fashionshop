import { useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util'
import DialogSelectOrder from './dialog-select-order';
import OrderReturnAction from './order-return-action';
import OrderReturnList from './order-return-list';
import OrderReturnSearch from './order-return-search';
import { useHistory } from 'react-router-dom';
type IOrderReturnIndexProps = StateProps & DispatchProps & {
}

const OrderReturnIndex = (props: IOrderReturnIndexProps) => {
    const history = useHistory();
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogSelectOrder, setShowDialogSelectOrder] = useState(false);
    const onAdd = () => {
        setShowDialogSelectOrder(true);
    }

    const onEdit = (rowData) => {
        history.push(`/admin/order-returns/edit/${rowData.id}`);
    }

    const onDelete = (rowData) => {
        CommonUtil.confirmDelete(() => {

        })
    }

    const afterSaveSuccess = () => {
        setShowDialog(false);
    }

    const onHide = () => {
        setShowDialogSelectOrder(false);
    }

    return (
        <>
            <section className="content">
                <OrderReturnAction
                    onAdd={onAdd}
                />
                <OrderReturnSearch />
                <OrderReturnList
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
                {
                    showDialogSelectOrder &&
                    <DialogSelectOrder
                        onHide={onHide}
                    />
                }
            </section>
        </>
    )
}

const mapStateToProps = ({ orderReturnReducerState, locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
    formSearch: orderReturnReducerState.formSearch
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderReturnIndex);
