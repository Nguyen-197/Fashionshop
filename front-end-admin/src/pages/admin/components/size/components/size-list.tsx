
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Panel } from 'primereact/panel';
import { useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { handleSearchSize } from 'src/reducers/size.reducer';

type ISizeListProps = StateProps & DispatchProps & {
    onAdd?: () => void, // Thêm mới
    onEdit?: (rowData) => void, // Cập nhật
    onDelete?: (rowData) => void, // Xóa
}

const SizeList = (props: ISizeListProps) => {
    const [configTable, setConfigTable] = useState({}) as any;
	const [selectedRow, setSelectedRow] = useState(null);

    /**
     * Chuyển trang
     * @param event
     */
    const onPage = (event) => {
		const eventConfig = {
            first: event.first,
            rows: event.rows,
            page: event.page,
            pageCount: event.pageCount,
        }
        setConfigTable(eventConfig);
        props.handleSearchSize(props.formSearch, eventConfig);
    }

    /**
     * Sort
     * @param event
     */
    const onSort = (event) => {
		const eventConfig = {
            first: event.first,
            rows: event.rows,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        }
        setConfigTable(eventConfig);
        props.handleSearchSize(props.formSearch, eventConfig);
    }

    /**
     * Thêm mới
     */
    const onAdd = () => {
        props.onAdd && props.onAdd();
    }

    /**
     * Cập nhật
     * @param rowData
     */
    const onEdit = (rowData) => {
        props.onEdit && props.onEdit(rowData);
    }

    /**
     * Xóa
     * @param rowData
     */
    const onDelete = (rowData) => {
        props.onDelete && props.onDelete(rowData);
    }

    const renderSTT = (rowData, x) => {
        return <>{x.rowIndex * 1 + 1}</>
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

    const templateHeader = (options) => {
        const className = `${options.className}`;
        const titleClassName = `${options.titleClassName} pl-1`;

        return (
            <div className={className}>
                <span className={titleClassName}>
                    { translate('size.manageSize') }
                </span>
            </div>
        )
    }

    return (
        <>
            <div className='wrap-table'>
				<Panel headerTemplate={templateHeader}>
                	<DataTable value={props.listSize?.data} totalRecords={props.listSize?.recordTotal * 1} first={props.listSize?.first * 1} rows={10} lazy
                    selection={selectedRow} onSelectionChange={e => setSelectedRow(e.value)} responsiveLayout="scroll" stripedRows showGridlines size="small"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate={translate('common.currentPageReportTemplate')} paginator={props.listSize?.data?.length > 0} selectionMode="single"
                    emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField} sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}>
                    	<Column header={translate('common.rowNum')} body={renderSTT} style={{ width: '70px' }}></Column>
                    	<Column field="code" header={translate('size.code')} sortable></Column>
                    	<Column field="name" header={translate('size.name')} sortable></Column>
                    	<Column header={translate('common.actionLabel')} body={renderActionColumn} style={{ width: '120px' }}></Column>
                	</DataTable>
            	</Panel>
			</div>
        </>
    )
}

const mapStateToProps = ({ sizeReducerState, locale, authentication }: IRootState) => ({
    currentLocale: locale.currentLocale,
    listSize: sizeReducerState.listSize as any,
    formSearch: sizeReducerState.formSearch,
    isAdmin: authentication.isAdmin
});

const mapDispatchToProps = {
    handleSearchSize
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SizeList);
