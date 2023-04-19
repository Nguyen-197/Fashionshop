import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { useHistory, useLocation } from 'react-router-dom';
import Navigation from 'src/components/layouts/Navigation';
import LayoutCheckout from 'src/components/layouts/LayoutCheckout';
import { TabView, TabPanel } from 'primereact/tabview';
import { useEffect, useLayoutEffect, useState } from 'react';
import { STATUS_ORDER } from 'src/@types/enums';
import { STATUS_ORDERS } from 'src/constants';
import orderServices from 'src/services/order.services';
import { CommonUtil } from 'src/utils/common-util';
import _ from 'lodash';
import PurchaseList from './purchase-list';
import { MAP_TAB_VIEW } from 'src/@types/constants';

type IPurchaseProps = StateProps & DispatchProps & {
}

const Purchase = (props: IPurchaseProps) => {
    const history = useHistory();
    const { search } = useLocation();
    const state = new URLSearchParams(search).get('state');
    const [stateActive, setStateActive] = useState<any>(state || 0);
    const [purchases, setPurchases] = useState([]);
    useLayoutEffect(() => {
        const fetchData = async () => {
            let _stateActive = state as any;
            if (CommonUtil.isNullOrEmpty(_stateActive)) _stateActive = STATUS_ORDER.WAITING_PAYMENT;
            const _state = MAP_TAB_VIEW[_stateActive];
            _stateActive = !CommonUtil.isNullOrEmpty(_state) ? _state : STATUS_ORDER.WAITING_PAYMENT;
            const rest = await orderServices.getOrderByStatus(_stateActive);
            setPurchases (rest.data.data);
        }
        setStateActive(Number(state));
        fetchData();
    }, [state]);

    const onTabChange = (event) => {
        history.push(`/purchase?state=${event.index}`);
    }

    const afterSaveSuccess = async (state: any) => {
        const _stateKey = CommonUtil.getKeyByValue(MAP_TAB_VIEW, state);
        history.push(`/purchase?state=${_stateKey}`);
    };
    return (
        <>
            <div style={{ paddingTop: 100, backgroundColor: '#F5F5F5' }}>
                <LayoutCheckout>
                    <>
                        <div className="layout-v2">
                            <Navigation />
                            <div className="purchase-wrap">
                                <TabView activeIndex={stateActive} onTabChange={onTabChange}>
                                    <TabPanel header="Chờ thanh toán">
                                        <PurchaseList state={state} afterSaveSuccess={afterSaveSuccess} purchases={purchases} />
                                    </TabPanel>
                                    <TabPanel header="Chờ xác nhận">
                                        <PurchaseList state={state} afterSaveSuccess={afterSaveSuccess} purchases={purchases} />
                                    </TabPanel>
                                    <TabPanel header="Chờ đóng gói">
                                        <PurchaseList state={state} afterSaveSuccess={afterSaveSuccess} purchases={purchases} />
                                    </TabPanel>
                                    <TabPanel header="Chờ lấy hàng">
                                        <PurchaseList state={state} afterSaveSuccess={afterSaveSuccess} purchases={purchases} />
                                    </TabPanel>
                                    <TabPanel header="Chờ nhận hàng">
                                        <PurchaseList state={state} afterSaveSuccess={afterSaveSuccess} purchases={purchases} />
                                    </TabPanel>
                                    <TabPanel header="Đã giao">
                                        <PurchaseList state={state} afterSaveSuccess={afterSaveSuccess} purchases={purchases} />
                                    </TabPanel>
                                    <TabPanel header="Đã hủy">
                                        <PurchaseList state={state} afterSaveSuccess={afterSaveSuccess} purchases={purchases} />
                                    </TabPanel>
                                </TabView>
                            </div>
                        </div>
                    </>
                </LayoutCheckout>
            </div>
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    isLoginSuccess: authentication.isLoginSuccess,
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(Purchase);
