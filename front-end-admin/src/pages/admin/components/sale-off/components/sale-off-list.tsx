
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Panel } from 'primereact/panel';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { translate } from 'react-jhipster';
import { CommonUtil } from 'src/utils/common-util';
import { SALE_OFF_STATUS } from 'src/@types/constants';
import _ from 'lodash';
import { BUSSINESS_TYPE, SALEOFF_STATUS } from 'src/enum';
type ISaleOffListProps = StateProps & DispatchProps & {
    onEdit?: (rowData) => void; // Cập nhật
    onChangeStatus?: (rowData, status) => void; // Xóa
    listSaleOff?: any;
    formSearch?: any; //
    handleSearch?: Function;
    configTable: any;
    handleUpdateConfigTable?: Function;
}

const SaleOffList = (props: ISaleOffListProps) => {
    const [configTable, setConfigTable] = useState({}) as any;
    const [selectedCustomers, setSelectedCustomers] = useState(null);

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
        (await props.handleSearch) && props.handleSearch(props.formSearch, eventConfig);
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
        (await props.handleSearch) && props.handleSearch(props.formSearch, eventConfig);
    }

    const footer = (
        <div className='w-100 text-center pt-2 area-button-form'>
            <Button type="submit" label="Tìm kiếm" icon="pi pi-search" className="p-button-sm" />
        </div>
    );
    const renderSTT = (rowData, x) => {
        return <>{x.rowIndex + 1}</>
    }

    const onEdit = (rowData) => {
        props.onEdit && props.onEdit(rowData);
    }

    const onChangeStatus = (rowData, status) => {
        props.onChangeStatus && props.onChangeStatus(rowData, status);
    }
    const templateHeader = (options) => {
        const className = `${options.className} `;
        const titleClassName = `${options.titleClassName} pl-1`;

        return (
            <div className={className}>
                <span className={titleClassName}>
                    {translate('category.manageCategory')}
                </span>
            </div>
        )
    }

    const renderStartDate = (rowData) => {
        return (<>{CommonUtil.renderDateToData(rowData.startDate, "DD-MM-YYYY HH:mm:ss")}</>);
    }

    const renderEndDate = (rowData) => {
        return (<>{CommonUtil.renderDateToData(rowData.endDate, "DD-MM-YYYY HH:mm:ss")}</>);
    }

    const renderStatus = (rowData) => {
        const item = CommonUtil.getValueByKey(SALE_OFF_STATUS, _.get(rowData, "isActive"));
        return (<span className={`tag-item ${item?.className}`}>{ item.name }</span>);
    }

    const renderActionColumn = (rowData) => (
        <div className='flex-center text-center'>
            <Button type="button" tooltip={translate('common.viewLabel')}
                icon="fa-solid fa-eye" className="p-button-rounded p-button-text p-button-info p-button-plain mr-2" onClick={() => onEdit(rowData)} tooltipOptions={{ position: 'top' }}
            />
            {
                props.isAdmin && rowData.isActive == SALEOFF_STATUS.LIVE &&
                <Button type="button" tooltip="Ngừng khuyến mại"
                    icon="fa-solid fa-circle-stop" className="p-button-rounded p-button-text p-button-danger p-button-plain mr-2" onClick={() => onChangeStatus(rowData, SALEOFF_STATUS.OFFLINE)} tooltipOptions={{ position: 'top' }}
                />
            }
            {
                props.isAdmin && rowData.isActive == SALEOFF_STATUS.OFFLINE &&
                <Button type="button" tooltip="Chạy khuyến mại"
                    icon="fa-solid fa-circle-play" className="p-button-rounded p-button-text p-button-danger p-button-plain mr-2" onClick={() => onChangeStatus(rowData, SALEOFF_STATUS.LIVE)} tooltipOptions={{ position: 'top' }}
                />
            }
        </div>
    )

    return (
        <>
            <div className='wrap-table'>
                <Panel headerTemplate={templateHeader}>
                    <DataTable value={props?.listSaleOff?.data} totalRecords={props?.listSaleOff?.recordTotal * 1} first={props.listSaleOff?.first * 1} rows={10} lazy scrollDirection="both"
                        scrollable stripedRows size="small" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate={translate('common.currentPageReportTemplate') || `({currentPage} of {totalPages})`} paginator={props?.listSaleOff.data?.length > 0}
                        emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField} sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}
                    >
                        <Column header="STT" body={renderSTT} style={{ flexGrow: 1, flexBasis: '70px' }} className="text-center"></Column>
                        <Column field="code" header="Mã khuyến mại" style={{ flexGrow: 1, flexBasis: '150px' }}></Column>
                        <Column field="name" header="Tên khuyến mại" sortable style={{ flexGrow: 1, flexBasis: '250px' }}></Column>
                        <Column header="Ngày bắt đầu" sortable style={{ flexGrow: 1, flexBasis: '150px' }} body={renderStartDate}></Column>
                        <Column header="Ngày kết thúc" sortable style={{ flexGrow: 1, flexBasis: '150px' }} body={renderEndDate}></Column>
                        <Column header="Trạng thái" style={{ flexGrow: 1, flexBasis: '150px' }} className="item-center" align="center" body={renderStatus}></Column>
                        <Column header="Thác tác" align="center" style={{ flexGrow: 1, flexBasis: '120px' }} body={renderActionColumn}></Column>
                    </DataTable>
                </Panel>
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
    mapDispatchToProps
    // @ts-ignore
)(SaleOffList);
