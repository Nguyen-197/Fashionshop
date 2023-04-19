
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
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import { PAYMENT_TYPE } from 'src/constants/constants';

type IDialogConfirmPaidProps = StateProps & DispatchProps & {
    productId?: number,
    onHide: () => void,
    onSelected?: Function,
}

const DialogConfirmPaid = forwardRef((props: IDialogConfirmPaidProps, ref: any) => {
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
        dialogRef.current && dialogRef.current.show();
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
                icon="pi pi-times"
                label={translate('common.cancelLabel')}
                className="p-button-danger"
                onClick={() => props.onHide && props.onHide()}
            />
            <Button
                form="confirm-paid-form"
                label="Thanh toán đơn hàng"
                icon="pi pi-check"
                onClick={onSelected}
            />
        </div>
    );
    return (
        <>
            <BaseDialog
                ref={dialogRef}
                onHide={() => props.onHide && props.onHide()}
                header="Xác nhận thanh toán"
                footer={footer}
                style={{ width: '50vw' }}
            >
                <form id="confirm-paid-form" onSubmit={(event) => CommonUtil.focusOnSubmitError(event, handleSubmit)}>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <BaseDropdownControl
                                autoFocus
                                property="paymentType"
                                labelKey="Phương thức thanh toán"
                                options={PAYMENT_TYPE}
                                optionLabel="label"
                                optionValue="id"
                                initialValue={_.get(values, 'paymentType')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <BaseTextControl
                                labelKey="Số tiền"
                                property='customerPay'
                                initialValue={_.get(values, 'customerPay')}
                                callbackValueChange={onChange}
                            />
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
)(DialogConfirmPaid);
