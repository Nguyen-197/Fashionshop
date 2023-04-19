
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Panel } from 'primereact/panel';
import { useEffect, useState } from 'react';
import { Field, useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { CommonUtil } from 'src/utils/common-util';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { translate } from 'react-jhipster';
import { handleSearchUser } from "src/reducers/customer.reducer";
type IUserListProps = StateProps & DispatchProps & {
    onEdit?: (rowData) => void, // Cập nhật
    onDelete?: (rowData) => void, // Xóa
}

const UserList = (props: IUserListProps) => {
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
        await props.handleSearchUser(props.formSearch, eventConfig);
    }
    useEffect(() => {


    }, []);
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
        await props.handleSearchUser(props.formSearch, eventConfig);
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

    const onDelete = (rowData) => {
        props.onDelete && props.onDelete(rowData);
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

    const renderActionColumn = (rowData) => (
        <div className='flex-center text-center'>
            <Button type="button" tooltip={translate('common.updateLabel')}
                icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-info p-button-plain mr-2" onClick={() => onEdit(rowData)} tooltipOptions={{ position: 'top' }}
            />
            {
                props.isAdmin && rowData.active &&
                <Button type="button" tooltip="Ngừng hoạt động"
                    icon="fa-solid fa-lock" className="p-button-rounded p-button-text p-button-danger p-button-plain mr-2" onClick={() => onDelete(rowData)} tooltipOptions={{ position: 'top' }}
                />
            }
            {
                props.isAdmin && !rowData.active &&
                <Button type="button" tooltip="Mở hoạt động"
                    icon="fa-solid fa-lock-open" className="p-button-rounded p-button-text p-button-danger p-button-plain mr-2" onClick={() => onDelete(rowData)} tooltipOptions={{ position: 'top' }}
                />
            }
        </div>
    )
    const roleBodyTemplate = (rowData) => {
        return <span>0</span>;
    }
    const activeBodyTemplate = (rowData) => {
        return <span>{rowData.active ? "Hoạt động" : "Khóa" || ''}</span>;
    }
    return (
        <>
            <div className='wrap-table'>
                <Panel headerTemplate={templateHeader}>
                    <DataTable value={props?.listUser?.data} totalRecords={props?.listUser?.recordTotal * 1} first={props.listUser?.first * 1} rows={10} lazy selectionMode="single" selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                        responsiveLayout="scroll" stripedRows showGridlines size="small"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate={translate('common.currentPageReportTemplate') || `({currentPage} of {totalPages})`} paginator={props?.listUser.data?.length > 0}
                        emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField} sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}>
                        <Column header="STT" body={renderSTT} style={{ width: '70px' }} className="text-center"></Column>
                        <Column field="fullName" header="Họ và Tên" sortable style={{ width: '150px' }}></Column>
                        <Column field="email" header="Email" sortable></Column>
                        <Column field="phoneNumber" header="Số điện thoại"></Column>
                        <Column header="Tổng chi tiêu" body={roleBodyTemplate}></Column>
                        <Column header="Tổng SL đặt hàng" body={roleBodyTemplate}></Column>
                        <Column field="active" header="Trạng thái" body={activeBodyTemplate}></Column>
                        <Column header="Thao tác" body={renderActionColumn} style={{ maxWidth: '70px' }}></Column>
                    </DataTable>
                </Panel>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale, customerReducerState, authentication }: IRootState) => ({
    currentLocale: locale.currentLocale,
    listUser: customerReducerState.listUser as any,
    formSearch: customerReducerState.formSearch,
    isAdmin: authentication.isAdmin
});

const mapDispatchToProps = {
    handleSearchUser
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
    // @ts-ignore
)(UserList);
