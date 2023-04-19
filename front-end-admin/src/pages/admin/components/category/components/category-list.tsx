
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Panel } from 'primereact/panel';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { translate } from 'react-jhipster';
import { handleSearchCategories } from "src/reducers/category.reducer";
type ICategoryListProps = StateProps & DispatchProps & {
    onEdit?: (rowData) => void, // Cập nhật
    onDelete?: (rowData) => void, // Xóa
}

const CategoryList = (props: ICategoryListProps) => {
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
        await props.handleSearchCategories(props.formSearch, eventConfig);
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
        await props.handleSearchCategories(props.formSearch, eventConfig);
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
                    { translate('category.manageCategory') }
                </span>
            </div>
        )
    }

    const renderActionColumn = (rowData) => (
        <div className='flex-center text-center'>
            <Button type="button" tooltip={translate('common.updateLabel')}
                icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-info p-button-plain mr-2" onClick={() => onEdit(rowData)} tooltipOptions={{ position: 'top' }}
            />
            {
                props.isAdmin &&
                <Button type="button" tooltip="Xóa"
                    icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger p-button-plain mr-2" onClick={() => onDelete(rowData)} tooltipOptions={{ position: 'top' }}
                />
            }
        </div>
    )

    return (
        <>
            <div className='wrap-table'>
                <Panel headerTemplate={templateHeader}>
                    <DataTable value={props.listCategories.data} totalRecords={props.listCategories.recordTotal * 1} first={props.listCategories.first * 1} rows={10} lazy selection={selectedRow} onSelectionChange={e => setSelectedRow(e.value)} selectionMode="single"
                        responsiveLayout="scroll" stripedRows showGridlines size="small"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate={translate('common.currentPageReportTemplate') || `({currentPage} of {totalPages})`} paginator={props.listCategories.data?.length > 0}
                        emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField} sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}>
                        {/* <Column headerStyle={{ width: '3em' }}></Column> */}
                        <Column header="STT" body={renderSTT} style={{ width: '70px' }} className="text-center"></Column>
                        <Column field="code" header="Mã danh mục" sortable style={{ width: '150px' }}></Column>
                        <Column field="name" header="Tên danh mục" sortable></Column>
                        <Column field="parentName" header="Danh mục cha"></Column>
                        <Column field="description" header="Mô tả"></Column>
                        <Column header="Thao tác" body={renderActionColumn} style={{ maxWidth: '50px' }}></Column>
                    </DataTable>
                </Panel>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale, categoryReducerState, authentication }: IRootState) => ({
    currentLocale: locale.currentLocale,
    listCategories: categoryReducerState.listCategories as any,
    formSearch: categoryReducerState.formSearch,
    isAdmin: authentication.isAdmin
});

const mapDispatchToProps = {
    handleSearchCategories
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
    // @ts-ignore
)(CategoryList);
