import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Toast } from 'src/components/toast/toast.utils';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { handleSearchProduct } from 'src/reducers/product.reducer';
import ProductService from 'src/services/product.services';
import { useHistory } from 'react-router';
import SaleOffAction from './sale-off-action';
import SaleOffList from './sale-off-list';
import SaleOffForm from './sale-off-form';
import SaleOffSearch from './sale-off-search';
import saleOffServices from 'src/services/sale-off.services';
import { RESPONSE_TYPE, SALEOFF_STATUS } from 'src/enum';
type IPromotionIndexProps = StateProps & DispatchProps & {
}

const PromotionIndex = (props: IPromotionIndexProps) => {
    const saleOffFormRef = useRef<any>(null);
    const history = useHistory();
    const [showSaleOffForm, setShowSaleOffForm] = useState(false);
    const [saleOffId, setSaleOffId] = useState(null);
    const [formSearch, setFormSearch] = useState({});
    const [configTable, setConfigTable] = useState({});
    const [listSaleOff, setListSaleOff] = useState({});

    const onAdd = () => {
        setShowSaleOffForm(true);
    }

    const onHide = () => {
        setShowSaleOffForm(false);
        setSaleOffId(null);
    }

    const onEdit = (rowData) => {
        setShowSaleOffForm(true)
        setSaleOffId(rowData.id);
    }

    const onChangeStatus = async (rowData, status) => {
        let message = "Bạn có chắn chắc muốn áp dụng chương trình khuyến mại này không ?";
        if (status === SALEOFF_STATUS.LIVE) {
            message = "Bạn có chắc chắn muốn ngừng chương trình khuyến mại này không ?";
        }
        await CommonUtil.confirmDelete(async () => {
            const response = await saleOffServices.changeStatus(rowData.id, status);
            if (response.data.type === RESPONSE_TYPE.SUCCESS) {
                await doSearch();
            }
        }, null, message);
    }

    const handleUpdateFormSearch = (data: any) => {
        setFormSearch({...formSearch, ...data});
    }

    const handleUpdateConfigTable = (data: any) => {
        setConfigTable(data);
    }

    const doSearch = async (formSearch?: any, event?: any) => {
        const resultSearch = await saleOffServices.search(formSearch, event);
        if (resultSearch.data.type === RESPONSE_TYPE.SUCCESS) {
            setListSaleOff(resultSearch.data.data);
        }
    }

    const afterSaveSuccess = async () => {
        await doSearch();
        setSaleOffId(null);
        setShowSaleOffForm(false);
    }

    useEffect(() => {
        doSearch();
    }, []);

    return (
        <>
            <section className="content">
                <SaleOffAction
                    onAdd={onAdd}
                />
                <SaleOffSearch
                    handleSearch={doSearch}
                    handleUpdateFormSearch={handleUpdateFormSearch}
                    handleUpdateConfigTable={handleUpdateConfigTable}
                />
                <SaleOffList
                    onEdit={onEdit}
                    onChangeStatus={onChangeStatus}
                    handleSearch={doSearch}
                    listSaleOff={listSaleOff}
                    formSearch={formSearch}
                    configTable={configTable}
                    handleUpdateConfigTable={handleUpdateConfigTable}
                />
            </section>
            { showSaleOffForm && <SaleOffForm
                saleOffId={saleOffId}
                onHide={onHide}
                ref={saleOffFormRef}
                afterSaveSuccess={afterSaveSuccess}
            /> }
        </>
    )
}

const mapStateToProps = ({ locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PromotionIndex);
