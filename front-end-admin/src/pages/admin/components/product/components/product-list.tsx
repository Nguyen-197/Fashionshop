
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Panel } from 'primereact/panel';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { translate } from 'react-jhipster';
import { handleSearchProduct } from "src/reducers/product.reducer";
import { BUSSINESS_TYPE } from 'src/enum';
type IProductListProps = StateProps & DispatchProps & {
    onView?: (rowData) => void,
    onEdit?: (rowData) => void, // Cập nhật
    onChangeBussiness?: (rowData, status) => void, // Xóa
}

const ProductList = (props: IProductListProps) => {
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
        await props.handleSearchProduct(props.formSearch, eventConfig);
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
        await props.handleSearchProduct(props.formSearch, eventConfig);
    }

    const footer = (
        <div className='w-100 text-center pt-2 area-button-form'>
            <Button type="submit" label="Tìm kiếm" icon="pi pi-search" className="p-button-sm" />
        </div>
    );

    const renderSTT = (rowData, x) => {
        return <>{x.rowIndex * 1 + 1}</>
    }

    const onView = (rowData) => {
        props.onView && props.onView(rowData);
    }

    const onEdit = (rowData) => {
        props.onEdit && props.onEdit(rowData);
    }

    const onChangeBussiness = (rowData, status) => {
        props.onChangeBussiness && props.onChangeBussiness(rowData, status);
    }
    const templateHeader = (options) => {
        const className = `${options.className} `;
        const titleClassName = `${options.titleClassName} pl-1`;

        return (
            <div className={className}>
                <span className={titleClassName}>
                    {translate('product.manageProduct')}
                </span>
            </div>
        )
    }

    const renderActionColumn = (rowData) => (
        <div className='flex-center text-center'>
            <Button type="button" tooltip={translate('common.viewLabel')}
                icon="fa-solid fa-eye" className="p-button-rounded p-button-text p-button-info p-button-plain mr-2" onClick={() => onView(rowData)} tooltipOptions={{ position: 'top' }} />
            { props.isAdmin && <Button type="button" tooltip={translate('common.updateLabel')} icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-info p-button-plain" onClick={() => onEdit(rowData)} tooltipOptions={{ position: 'top' }} /> }
            { props.isAdmin && !rowData.isDelete && <Button type="button" tooltip="Ngừng kinh doanh" icon="fa-solid fa-store-slash" className="p-button-rounded p-button-text p-button-danger p-button-plain ml-2" onClick={() => onChangeBussiness(rowData, BUSSINESS_TYPE.STOP)} tooltipOptions={{ position: 'top' }} /> }
            { props.isAdmin && rowData.isDelete && <Button type="button" tooltip="Mở kinh doanh" icon="fa-solid fa-basket-shopping" className="p-button-rounded p-button-text p-button-danger p-button-plain ml-2" onClick={() => onChangeBussiness(rowData, BUSSINESS_TYPE.CONTINUE)} tooltipOptions={{ position: 'top' }} /> }
        </div>
    )
    const renderImg = (rowData) => {
        const image = rowData.image.split(";")

        return (
            <>
                <img className='object-fit-contain rounded' width={130} height={100} src={image[0]} alt={rowData.name} />
            </>
        )
    }

    return (
        <>
            <div className='wrap-table scroll-table'>
                <Panel headerTemplate={templateHeader}>
                    <DataTable value={props.listProduct.data} totalRecords={props.listProduct.recordTotal * 1} first={props.listProduct.first * 1} rows={10} lazy scrollable scrollDirection="both" stripedRows size="small" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate={translate('common.currentPageReportTemplate') || `({currentPage} of {totalPages})`} paginator={props.listProduct.data?.length > 0}
                        emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField} sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}>
                        <Column header="STT" body={renderSTT} alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '70px' }} className="text-center"></Column>
                        <Column header="Hình mẫu" body={renderImg} alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '150px' }}></Column>
                        <Column field="code" header="Mã sản phẩm" style={{ flexGrow: 1, flexBasis: '150px' }}></Column>
                        <Column field="name" header="Tên sản phẩm" sortable style={{ flexGrow: 1, flexBasis: '350px' }}></Column>
                        <Column field="categoryName" header="Danh mục" alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="mass" header="Khối lượng" sortable alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
                        <Column field="quantity" header="Số lượng" sortable alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
                        <Column header="Thao tác" body={renderActionColumn} alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '150px' }}></Column>
                    </DataTable>
                </Panel>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale, productReducerState, authentication }: IRootState) => ({
    isAdmin: authentication.isAdmin,
    currentLocale: locale.currentLocale,
    listProduct: productReducerState.listProduct as any,
    formSearch: productReducerState.formSearch,
});

const mapDispatchToProps = {
    handleSearchProduct
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
    // @ts-ignore
)(ProductList);
