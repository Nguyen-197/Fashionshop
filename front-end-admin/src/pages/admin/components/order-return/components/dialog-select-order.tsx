
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { Button } from 'primereact/button';
import { translate } from 'react-jhipster';
import { RESPONSE_TYPE, STATUS_ORDER } from 'src/enum';
import BaseDialog from 'src/app/components/BaseDialog';
import _ from 'lodash';
import { forwardRef, useEffect, useRef, useState } from 'react';
import BaseTextControl from 'src/app/components/BaseTextControl';
import { useFormik } from 'formik';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';
import orderServices from 'src/services/order.services';
import { useHistory } from "react-router-dom";

type IDialogSelectOrderProps = StateProps & DispatchProps & {
    onHide: () => void,
    onSelected?: Function,
}

const DialogSelectOrder = forwardRef((props: IDialogSelectOrderProps, ref: any) => {
    const history = useHistory();
    const dialogRef = useRef<any>(null);
    const [datasource, setDatasource] = useState<any>({});
    const [formSearch, setFormSearch] = useState<any>({});
    const [configTable, setConfigTable] = useState({}) as any;
    const [selectedRow, setSelectedRow] = useState(null);
    const {
        values,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {

        },
        onSubmit: async (data: any) => {
            await doSearch(data);
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            await doSearch();
            dialogRef.current && dialogRef.current.show();
        }
        fetchData();
    }, []);

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
        await doSearch(formSearch, eventConfig);
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
        await doSearch(formSearch, eventConfig);
    }

    const doSearch = async (data?: any, event?: any) => {
        const restSearch = await orderServices.searchOrderProbablyReturn(data, event);
        if (restSearch.data.type == RESPONSE_TYPE.SUCCESS) {
            setDatasource(restSearch.data.data);
        }
    }

    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    };

    const renderSTT = (rowData, x) => {
        return <>{x.rowIndex * 1 + 1}</>
    }

    const onRowClick = (rowData) => {
        history.push(`/admin/order-returns/create?orderId=${rowData.data.id}`);
    }

    return (
        <>
            <BaseDialog
                ref={dialogRef}
                onHide={() => props.onHide && props.onHide()}
                header="Chọn đơn hàng để trả"
                style={{ width: '70vw' }}
            >
                <form id="customer-form" onSubmit={(event) => CommonUtil.focusOnSubmitError(event, handleSubmit)}>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <BaseTextControl
                                autoFocus
                                showLabel={false}
                                labelKey="Tìm kiếm theo mã đơn hàng, tên, SĐT khách hàng"
                                placeholder="Tìm kiếm theo mã đơn hàng, tên, SĐT khách hàng"
                                property='name'
                                initialValue={_.get(values, 'name')}
                                callbackValueChange={onChange}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <DataTable value={datasource?.data ?? []} totalRecords={datasource?.recordTotal * 1} first={datasource?.first * 1} rows={10}
                                lazy selection={selectedRow} onSelectionChange={e => setSelectedRow(e.value)} selectionMode="multiple"
                                responsiveLayout="scroll" stripedRows size="small" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                currentPageReportTemplate={translate('common.currentPageReportTemplate') || `({currentPage} of {totalPages})`}
                                paginator={datasource?.data?.length > 0} emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField}
                                sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage} onRowClick={onRowClick}
                            >
                                <Column header="STT" body={renderSTT} style={{ width: '70px' }} alignHeader="center" align="center"></Column>
                                <Column field="orderCode" header="Mã đơn hàng" alignHeader="left" style={{ width: '180px' }}></Column>
                                <Column field="createDate" header="Ngày tạo" body={(rowData) => <>{CommonUtil.renderDateToData(rowData.createDate, "DD-MM-YYYY HH:mm:ss")}</>} style={{ width: '200px' }}></Column>
                                <Column field="createBy" header="Nhân viên"></Column>
                                <Column field="fullName" header="Khách hàng" alignHeader="left"></Column>
                                <Column header="Tổng tiền" alignHeader="center" align="center" body={(rowData) => <>{CommonUtil.formatMoney(rowData.totalPrice)}</>} style={{ width: '100px' }}></Column>
                            </DataTable>
                        </div>
                    </div>
                </form>
            </BaseDialog>
        </>
    )
})

const mapStateToProps = ({ }: IRootState) => ({

});

const mapDispatchToProps = {

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
)(DialogSelectOrder);
