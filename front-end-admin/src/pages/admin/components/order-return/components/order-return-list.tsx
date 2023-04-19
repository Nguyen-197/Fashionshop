
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Panel } from 'primereact/panel';
import { forwardRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { translate } from 'react-jhipster';
import { handleSearchOrderReturn } from "src/reducers/orders-return.reducer";
import { useHistory } from 'react-router-dom';
import { CommonUtil } from 'src/utils/common-util';
import { ORDER_RETURN_STATUS, STATUS_REFUND } from 'src/@types/constants';
import { REASON_OPTION } from 'src/constants/constants';
import _ from 'lodash';
import { RadioButton } from 'primereact/radiobutton';
import { PAYMENT_STATUS } from 'src/enum';
type IOrderReturnListProps = StateProps & DispatchProps & {
    onEdit?: (rowData) => void, // Cập nhật
    onDelete?: (rowData) => void, // Xóa
}

const OrderReturnList = forwardRef((props: IOrderReturnListProps, ref: any) => {
    const history = useHistory();
    const [configTable, setConfigTable] = useState({}) as any;
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
        await props.handleSearchOrderReturn(props.formSearch, eventConfig);
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
        await props.handleSearchOrderReturn(props.formSearch, eventConfig);
    }

    const renderSTT = (rowData, x) => {
        return <>{x.rowIndex + 1}</>
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
                    Quản lý đơn trả hàng
                </span>
            </div>
        )
    }

    const renderActionColumn = (rowData) => (
        <div className='text-center'>
            <i className="icon-action pi pi-pencil text-primary" title={translate('common.updateLabel')} onClick={() => props.onEdit && props.onEdit(rowData)}></i>
        </div>
    )

    const renderStatus = (rowData?: any) => {
        const _temp = CommonUtil.getValueByKey(ORDER_RETURN_STATUS, rowData.status);
        return (<span className={`tag-item ${_temp?.className}`}>{ _temp.name }</span>);
    }

    const renderStatusRefund = (rowData) => {
        return (<div><RadioButton inputId={`${rowData.id}`} name={`${rowData.name}`} checked={rowData.statusRefund === PAYMENT_STATUS.PAID} /></div>)
    }

    const renderTotal = (rowData) => {
        return <span>{CommonUtil.formatMoney(rowData.totalRefund)}</span>;
    }

    const renderCreateDate = (rowData) => {
        return (<>{ CommonUtil.renderDateToData(rowData.createDateReceive, 'DD-MM-YYYY HH:mm:ss') }</>);
    }
    const renderReason = (rowData) => {
        const _temp = CommonUtil.getValueByKey(REASON_OPTION, rowData.reason * 1);
        return (<>{ _.get(_temp, "name") }</>);
    }
    return (
        <>
            <div className='wrap-table order-return-list'>
                <Panel headerTemplate={templateHeader}>
                    <DataTable value={props?.listOrderReturn?.data} totalRecords={props?.listOrderReturn?.recordTotal * 1} first={props.listOrderReturn?.first * 1} rows={10} lazy scrollDirection="both"
                        scrollable stripedRows size="small" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate={translate('common.currentPageReportTemplate') || `({currentPage} of {totalPages})`} paginator={props?.listOrderReturn.data?.length > 0}
                        emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField} sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}
                    >
                        <Column header="STT" body={renderSTT} style={{ flexGrow: 1, flexBasis: '70px' }} className="text-center"></Column>
                        <Column field="returnCode" header="Mã đơn trả hàng" sortable style={{ flexGrow: 1, flexBasis: '150px' }} alignHeader="left" align="left"></Column>
                        <Column field="orderCode" header="Mã đơn hàng" sortable style={{ flexGrow: 1, flexBasis: '150px' }} alignHeader="left" align="left"></Column>
                        <Column field="fullName" header="Khách hàng" sortable alignHeader="left" align="left" style={{ flexGrow: 1, flexBasis: '180px' }}></Column>
                        <Column field="status" header="Trạng thái" className="item-center" align="center" style={{ flexGrow: 1, flexBasis: '200px' }} body={renderStatus}></Column>
                        <Column field="totalRefund" header="Hoàn tiền" className="item-center" align="center" sortable style={{ flexGrow: 1, flexBasis: '150px' }} body={renderStatusRefund}></Column>
                        <Column header="Tổng tiền" align="center" style={{ flexGrow: 1, flexBasis: '150px' }} body={renderTotal}></Column>
                        <Column field="createDate" header="Ngày nhận hàng" align="center" style={{ flexGrow: 1, flexBasis: '150px' }} sortable body={renderCreateDate}></Column>
                        <Column field="reason" header="Lý do trả hàng" align="center" style={{ flexGrow: 1, flexBasis: '200px' }} body={renderReason}></Column>
                        <Column header="Thác tác" align="center" style={{ flexGrow: 1, flexBasis: '120px' }} body={renderActionColumn}></Column>
                    </DataTable>
                </Panel>
            </div>
        </>
    )
})

const mapStateToProps = ({ locale, orderReturnReducerState }: IRootState) => ({
    currentLocale: locale.currentLocale,
    listOrderReturn: orderReturnReducerState.listOrderReturn as any,
    formSearch: orderReturnReducerState.formSearch
});

const mapDispatchToProps = {
    handleSearchOrderReturn
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
)(OrderReturnList);
