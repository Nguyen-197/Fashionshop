
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Panel } from 'primereact/panel';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { translate } from 'react-jhipster';
import { handleSearchProductDetails } from "src/reducers/product-details.reducer";
type IProductDetailsListProps = StateProps & DispatchProps & {
    onEdit?: (rowData) => void, // Cập nhật
    onDelete?: (rowData) => void, // Xóa
}

const ProductDetailsList = (props: IProductDetailsListProps) => {
    const [configTable, setConfigTable] = useState({}) as any;
    const [selectedRow, setSelectedRow] = useState(null);


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
        await props.handleSearchProductDetails(props.formSearch, eventConfig);
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
        await props.handleSearchProductDetails(props.formSearch, eventConfig);
    }

    const footer = (
        <div className='w-100 text-center pt-2 area-button-form'>
            <Button type="submit" label="Tìm kiếm" icon="pi pi-search" className="p-button-sm" />
        </div>
    );
    const renderSTT = (rowData, x) => {
        return <>{x.rowIndex * 1 + 1}</>
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
                    { translate('product.manageProduct') }
                </span>
            </div>
        )
    }

    const renderActionColumn = (rowData) => (
        <div className='text-center'>
            <i className="icon-action pi pi-pencil text-primary" title={translate('common.updateLabel')} onClick={() => onEdit(rowData)}></i>
            <i className="icon-action pi pi-trash ml-2 text-danger" title={translate('common.deleteLabel')} onClick={() => onDelete(rowData)}></i>
        </div>
    )

    return (
        <>
            <div className='wrap-table'>
                <Panel headerTemplate={templateHeader}>
                    <DataTable value={props.listProductDetails.data} totalRecords={props.listProductDetails.recordTotal * 1} first={props.listProductDetails.first * 1} rows={10} lazy selection={selectedRow} onSelectionChange={e => setSelectedRow(e.value)}
                        responsiveLayout="scroll" stripedRows showGridlines size="small"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate={translate('common.currentPageReportTemplate') || `({currentPage} of {totalPages})`} paginator={props.listProductDetails.data?.length > 0}
                        emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField} sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                        <Column header="STT" body={renderSTT} style={{ width: '70px' }} className="text-center"></Column>
                        <Column field="image" header="Ảnh sản phẩm" style={{ width: '150px' }}></Column>
                        <Column field="name" header="Tên phiên bản" style={{ width: '150px' }}></Column>
                        <Column field="costPrice" header="Giá nhập" sortable style={{ width: '150px' }}></Column>
                        <Column field="salePrice" header="Giá bán" sortable></Column>
                        <Column field="idColor" header="Màu sắc"></Column>
                        <Column field="idSize" header="Kích cỡ"></Column>
                        <Column field="idSize" header="Khối lượng" sortable></Column>
                        <Column header="Thao tác" body={renderActionColumn} style={{ maxWidth: '50px' }}></Column>
                    </DataTable>
                </Panel>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale, productDetailsReducerState }: IRootState) => ({
    currentLocale: locale.currentLocale,
    listProductDetails: productDetailsReducerState.listProductDetails as any,
    formSearch: productDetailsReducerState.formSearch
});

const mapDispatchToProps = {
    handleSearchProductDetails
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
    // @ts-ignore
)(ProductDetailsList);
