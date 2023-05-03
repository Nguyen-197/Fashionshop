
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Panel } from 'primereact/panel';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button } from 'primereact/button';
import { CommonUtil } from 'src/utils/common-util';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { translate } from 'react-jhipster';
import { handleSearchOrders } from "src/reducers/orders.reducer";
import { STATUS_ORDERS } from 'src/@types/constants';
import { RadioButton } from 'primereact/radiobutton';
import { PAYMENT_STATUS, RESPONSE_TYPE } from 'src/enum';
import orderDetailServices from 'src/services/order-detail.services';
import { useHistory } from 'react-router-dom';
import { Image } from 'primereact/image';
type IOrderListProps = StateProps & DispatchProps & {
    onEdit?: (rowData) => void, // Cập nhật
    onDelete?: (rowData) => void, // Xóa
}

const OrderList = forwardRef((props: IOrderListProps, ref: any) => {
    const history = useHistory();
    const [configTable, setConfigTable] = useState({}) as any;
    const [expandedRows, setExpandedRows] = useState(null);
    /**
     * Chuyển trang
     * @param event
     */
    const onPage = async (event) => {
        const eventConfig = {
            first: event.first,
            rows: event.rows,
            page: event.page,
            pageCount: event.pageCount,
        }
        setConfigTable(eventConfig);
        await props.handleSearchOrders(props.formSearch, eventConfig);
    }
    /**
     * Sort
     * @param event
     */
    const onSort = async (event) => {
        const eventConfig = {
            first: event.first,
            rows: event.rows,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        }
        setConfigTable(eventConfig);
        await props.handleSearchOrders(props.formSearch, eventConfig);
    }

    useEffect(() => {
        setExpandedRows(null);
    }, [props?.listOrder?.data]);

    useImperativeHandle(ref, () => ({
        clearExpandedRows() {
            setExpandedRows(null);
        }
    }));

    const renderSTT = (rowData, x) => {
        return <>{x.rowIndex + 1}</>
    }

    const renderImage = (rowData) => {
        return <Image src={rowData.image} alt={`${rowData.productName}`} width="50" preview />
    }

    const onEdit = (rowData) => {
        props.onEdit && props.onEdit(rowData);
    }

    const onDelete = (rowData) => {
        props.onDelete && props.onDelete(rowData);
    }
    const templateHeader = (options) => {
        const className = `${options.className} `;
        const titleClassName = `${options.titleClassName} pl-1`;

        return (
            <div className={className}>
                <span className={titleClassName}>
                    Quản lý đơn hàng
                </span>
            </div>
        )
    }

    const renderActionColumn = (rowData) => (
        <div className='text-center'>
            <i className="icon-action pi pi-pencil text-primary" title="Cập nhật" onClick={() => onEdit(rowData)}></i>
            <i className="icon-action pi pi-trash ml-2 text-danger" title="Xóa" onClick={() => onDelete(rowData)}></i>
        </div>
    )
    const statusPayment = (rowData) => {
        return (<div><RadioButton inputId={`${rowData.id}`} name={`${rowData.name}`} checked={rowData.paymentStatus === PAYMENT_STATUS.PAID} /></div>);
    }
    const renderTotal = (rowData) => {
        return <span>{CommonUtil.formatMoney(rowData.customerPay*1)}</span>;
    }
    const onRowToggle = async (event) => {
        const mapRowData = {};
        expandedRows?.forEach((rowData) => mapRowData[rowData.id] = rowData);
        const _dataToogle = event.data;
        const _index = _dataToogle.findIndex(item => !mapRowData[item.id]);
        if (_index != -1 && !_dataToogle[_index].productInfo) {
            const rest = await orderDetailServices.getDetailOrder(_dataToogle[_index].id);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                _dataToogle[_index].productInfo = rest.data.data;
            }
        }
        setExpandedRows(_dataToogle);
    }
    const renderNameOrPhone = (data) => {
        const _temp = [];
        data.fullName && _temp.push(data.fullName);
        data.phoneNumber && _temp.push(data.phoneNumber);
        return _temp.join(" - ");
    }
    const renderQuantityOrder = (productInfo) => {
        if (CommonUtil.isEmpty(productInfo)) return 0;
        return productInfo.reduce((current, item) => current += item.quantity, 0)
    }
    const onViewOrder = (rowData?: any) => {
        history.push(`/admin/orders/view/${rowData.id}`);
    }
    const onEditOrder = (rowData?: any) => {
        history.push(`/admin/orders/edit/${rowData.id}`);
    }
    const rowExpansionTemplate = (data) => {
        return (
            <div className="order-detail-wrap">
                <div className="flex">
                    <div style={{ flex: 2 }}>
                        <div className="box-item">
                            <div className="card-item order-info">
                                <h3 className="title">Thông tin đơn hàng</h3>
                                <div className="order-content">
                                    <div className="wrap-label">
                                        <p className="text-label">Mã đơn hàng:</p>
                                        <p className="text-label">Ngày tạo:</p>
                                        {/* <p className="text-label">Nhân viên bán hàng:</p> */}
                                    </div>
                                    <div className="wrap-content">
                                        <p className="text-label">{data.orderCode}</p>
                                        <p className="text-label">{ CommonUtil.renderDateToData(data.createDate, "DD/MM/YYYY HH:mm:ss") }</p>
                                        {/* <p className="text-label">Nhân viên bán hàng</p> */}
                                    </div>
                                </div>
                            </div>
                            <div className="card-item cus-info">
                                <h3 className="title">Khách hàng</h3>
                                <div className="wrap-content">
                                    <p className="text-label text-wrap">{renderNameOrPhone(data)}</p>
                                    <p className="text-label text-wrap">{data.addressFull}</p>
                                </div>
                            </div>
                            <div className="card-item note">
                                <h3 className="title">Ghi chú đơn hàng</h3>
                                { !data.note && <p className="p-empty">Đơn hàng không có ghi chú</p> }
                            </div>
                        </div>
                        <div className="box-item ship-info">
                            <div className="card-item order-info">
                                <h3 className="title">Thông tin giao hàng</h3>
                                <div className="order-content">
                                    <div className="wrap-label">
                                        <p className="text-label">Giao qua:</p>
                                        <p className="text-label">Mã vận đơn:</p>
                                        <p className="text-label">Trạng thái: </p>
                                    </div>
                                    <div className="wrap-content">
                                        <p className="text-label">GHN</p>
                                        <p className="text-label">{ CommonUtil.renderDateToData(data.createDate, "DD/MM/YYYY HH:mm:ss") }</p>
                                        <p className="text-label">{renderStatus(data)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-item cus-info">
                                <div className="wrap-label">
                                    <p className="text-label">Thu hộ:</p>
                                    <p className="text-label">Phí trả shipper:</p>
                                    <p className="text-label">Người trả phí:</p>
                                </div>
                                <div className="wrap-content">
                                    <p className="text-label">{CommonUtil.formatMoney(data.totalPrice)}</p>
                                    <p className="text-label text-wrap">0</p>
                                    <p className="text-label text-wrap">Người nhận</p>
                                </div>
                            </div>
                            <div className="card-item note">
                                <h3 className="title">Ghi chú đơn hàng</h3>
                                { !data.note && <p className="p-empty">Đơn hàng không có ghi chú</p> }
                            </div>
                        </div>
                    </div>
                    <div className="datatable-action">
                        <Button
                            label="In đơn hàng"
                        />
                        <Button
                            label="Xem chi tiết đơn hàng"
                            className="p-button-danger"
                            onClick={() => onViewOrder(data)}
                        />
                        {
                            data.status === 0 && 
                            <Button
                                label="Sửa đơn hàng"
                                className="p-button-text"
                                onClick={() => onEditOrder(data)}
                            />
                        }
                    </div>
                </div>
                <DataTable value={data?.productInfo} stripedRows size="small" responsiveLayout="scroll">
                    <Column header="STT" body={renderSTT} style={{ width: '70px' }} className="text-center"></Column>
                    <Column header="Ảnh" body={renderImage} style={{ width: '70px' }} className="text-center"></Column>
                    <Column header="Mã sản phẩm" field="code" style={{ width: '150px' }} className="text-center"></Column>
                    <Column header="Tên sản phẩm" field="productName"></Column>
                    <Column header="Số lượng" field="quantity"className="text-center" style={{ width: '120px' }}></Column>
                    <Column header="Đơn giá" body={(rowData) => <>{CommonUtil.formatMoney(rowData.unitPrice)}</>} className="text-center" style={{ width: '150px' }}></Column>
                    <Column header="Thành tiền" body={(rowData) => <>{CommonUtil.formatMoney(rowData.totalPrice)}</>} className="text-center" style={{ width: '150px' }}></Column>
                </DataTable>
                <div className="footer">
                    <div className="footer-item">
                        <p>Tổng tiền ({renderQuantityOrder(data?.productInfo)} sản phẩm)</p>
                        <p>{CommonUtil.formatMoney(data.totalPrice)}</p>
                    </div>
                    <div className="footer-item">
                        <p>Phí giao hàng</p>
                        <p>{CommonUtil.formatMoney(data.deliveryCost)}</p>
                    </div>
                    <div className="footer-item">
                        <p>Khách phải trả</p>
                        <p>{CommonUtil.formatMoney(data.customerPay)}</p>
                    </div>
                </div>
            </div>
        );
    }
    const renderCreateDate = (rowData) => {
        return (<>{ CommonUtil.renderDateToData(rowData.createDate, 'DD/MM/YYYY HH:mm:ss') }</>);
    }
    const renderStatus = (rowData) => {
        const _temp = CommonUtil.getValueByKey(STATUS_ORDERS, rowData.status);
        return (<span className={`tag-item ${_temp.className}`}>{ _temp.name }</span>)
    }
    return (
        <>
            <div className='wrap-table'>
                <Panel headerTemplate={templateHeader}>
                    <DataTable value={props?.listOrder?.data} totalRecords={props?.listOrder?.recordTotal * 1} first={props.listOrder?.first * 1} rows={10} lazy scrollable responsiveLayout="scroll" stripedRows size="small"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate={translate('common.currentPageReportTemplate') || `({currentPage} of {totalPages})`} paginator={props?.listOrder.data?.length > 0}
                        emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField} sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}
                        expandedRows={expandedRows} onRowToggle={onRowToggle} rowExpansionTemplate={rowExpansionTemplate}
                    >
                        <Column expander style={{ maxWidth: '50px' }} />
                        <Column header="STT" body={renderSTT} alignHeader="center" align="center" style={{ maxWidth: '70px' }} className="text-center"></Column>
                        <Column field="orderCode" header="Mã đơn hàng" sortable style={{ maxWidth: '130px' }} alignHeader="left" align="left"></Column>
                        <Column field="createDate" header="Ngày tạo đơn" sortable body={renderCreateDate} style={{ maxWidth: '180px' }}></Column>
                        <Column field="fullName" header="Tên khách hàng" sortable></Column>
                        <Column field="status" header="Trạng thái đơn hàng" className="item-center" align="center" body={renderStatus}></Column>
                        <Column header="Trạng thái thanh toán" align="center" body={statusPayment}></Column>
                        <Column header="Khách phải trả" alignHeader="center" align="center" body={renderTotal}></Column>
                    </DataTable>
                </Panel>
            </div>
        </>
    )
})

const mapStateToProps = ({ locale, orderReducerState }: IRootState) => ({
    currentLocale: locale.currentLocale,
    listOrder: orderReducerState.listOrder as any,
    formSearch: orderReducerState.formSearch
});

const mapDispatchToProps = {
    handleSearchOrders
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
const options = { forwardRef: true };
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
    // @ts-ignore
)(OrderList);
