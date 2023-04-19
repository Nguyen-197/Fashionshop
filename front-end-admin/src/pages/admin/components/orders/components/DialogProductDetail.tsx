
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { Button } from 'primereact/button';
import { translate } from 'react-jhipster';
import { RESPONSE_TYPE } from 'src/enum';
import BaseDialog from 'src/app/components/BaseDialog';
import _ from 'lodash';
import { forwardRef, useEffect, useRef, useState } from 'react';
import BaseTextControl from 'src/app/components/BaseTextControl';
import { useFormik } from 'formik';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';
import productDetailsServices from 'src/services/product-details.services';

type IDialogProductDetailProps = StateProps & DispatchProps & {
    productId?: number,
    onHide: () => void,
    onSelected?: Function,
}

const DialogProductDetail = forwardRef((props: IDialogProductDetailProps, ref: any) => {
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
        const fetchDatasource = async () => {
            if (props.productId) {
                await doSearch({ idProduct: props.productId });
            }
            dialogRef.current && dialogRef.current.show();
        }
        fetchDatasource();
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
        const restSearch = await productDetailsServices.searchDetail(data, event);
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

    const renderImg = (rowData) => {
        return <Image src={rowData.image} alt={`${rowData.productName}`} width="50" preview />
    }

    const renderFinalPrice = (rowData) => {
        const _price = rowData.salePrice > 0 ? rowData.salePrice : rowData.finalPrice;
        return <>{CommonUtil.formatMoney(_price)}</>
    }

    const onSelected = () => {
        props.onSelected && props.onSelected(selectedRow);
        // props.onHide && props.onHide();
    }

    const footer = (
        <div className='text-center'>
            <Button
                form="customer-form"
                label={translate('common.saveLabel')}
                icon="pi pi-check"
                onClick={onSelected}
            />
            <Button
                icon="pi pi-times"
                label={translate('common.cancelLabel')}
                className="p-button-danger"
                onClick={() => props.onHide && props.onHide()}
            />
        </div>
    );
    return (
        <>
            <BaseDialog
                ref={dialogRef}
                onHide={() => props.onHide && props.onHide()}
                header="Chọn sản phẩm để bán hàng"
                footer={footer}
                style={{ width: '70vw' }}
            >
                <form id="customer-form" onSubmit={(event) => CommonUtil.focusOnSubmitError(event, handleSubmit)}>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <BaseTextControl
                                autoFocus
                                labelKey="Tìm kiếm sản phẩm"
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
                                sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}
                            >
                                <Column header="STT" body={renderSTT} style={{ width: '70px' }} alignHeader="center" align="center"></Column>
                                <Column header="Hình ảnh" alignHeader="center" align="center" body={renderImg} style={{ width: '70px' }}></Column>
                                <Column field="productName" header="Tên sản phẩm"></Column>
                                <Column field="categoryName" header="Danh mục sản phẩm" style={{ width: '150px' }}></Column>
                                <Column field="colorName" header="Màu sắc" alignHeader="center" align="center" style={{ width: '100px' }}></Column>
                                <Column field="sizeName" header="Kích cỡ" alignHeader="center" align="center" style={{ width: '100px' }}></Column>
                                <Column header="Tồn kho" alignHeader="center" align="center" body={(rowData) => <>{rowData.quantity} sản phẩm</>} style={{ width: '100px' }}></Column>
                                <Column header="Giá" alignHeader="center" align="center" body={renderFinalPrice} style={{ width: '100px' }}></Column>
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
)(DialogProductDetail);
