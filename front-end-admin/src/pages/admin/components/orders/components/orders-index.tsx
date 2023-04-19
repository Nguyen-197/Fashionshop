import { useRef } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Toast } from 'src/components/toast/toast.utils';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util'
import { handleSearchOrders } from 'src/reducers/orders.reducer';
import UserService from 'src/services/user.services';
import OrdersAction from './orders-action';
import OrdersList from './orders-list';
import OrdersSearch from './orders-search';
import { useHistory } from 'react-router-dom';
type IUserIndexProps = StateProps & DispatchProps & {
}

const UserIndex = (props: IUserIndexProps) => {
    const history = useHistory();
    const orderListRef = useRef<any>(null);

    const onAdd = () => {
        history.push(`/admin/orders/create`);
    }

    const onEdit = (rowData) => {
        history.push(`/admin/orders/edit/${rowData.id}`);
    }

    const onDelete = (rowData) => {
        CommonUtil.confirmDelete(() => {
            UserService.delete(rowData.id).then(() => {
                Toast.success(translate('common.deleted'));
                props.handleSearchOrders(props.formSearch);
            });
        })
    }

    const afterSaveSuccess = () => {
        props.handleSearchOrders(props.formSearch);
    }

    const onHide = () => {
    }

    const toCapitalize = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    return (
        <>
            <section className="content">
                <OrdersAction
                    onAdd={onAdd}
                />
                <OrdersSearch />
                <OrdersList
                    ref={orderListRef}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </section>
        </>
    )
}

const mapStateToProps = ({ orderReducerState, locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
    formSearch: orderReducerState.formSearch
});

const mapDispatchToProps = {
    handleSearchOrders
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserIndex);
