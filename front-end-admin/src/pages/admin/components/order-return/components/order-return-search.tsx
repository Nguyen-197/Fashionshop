
import { Button } from 'primereact/button';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { handleSearchOrderReturn, handleUpdateFormSearch } from 'src/reducers/orders-return.reducer';
import { translate } from 'react-jhipster';
import { useFormik } from 'formik';
import BaseTextControl from 'src/app/components/BaseTextControl';
import _ from 'lodash';
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import userServices from 'src/services/user.services';
import { PAYMENTS_STATUS, STATUS_ORDERS } from 'src/@types/constants';
import { CommonUtil } from 'src/utils/common-util';
type IOrderReturnSearchProps = StateProps & DispatchProps & {
}

const OrderReturnSearch = (props: IOrderReturnSearchProps) => {
    const {
        values,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {
            orderCode: "",
            idUser: "",
            status: "",
            paymentStatus: ""
        },
        onSubmit: async (data: any) => {
            await doSearch(data);
        },
    });
    /**
     * Action t�m ki?m
     */
    const doSearch = (data?) => {
        props.handleSearchOrderReturn(data);
    }

    const footer = (
        <div className="w-100 justify-content-center align-items-center btn-group pt-3">
            <Button type="submit" label={translate('common.searchLabel')} icon="pi pi-search" className="p-button-sm p-button-danger" />
            <Button label={translate('common.resetLabel')} icon="pi pi-sync" className="p-button-sm" />
        </div>
    );

    useEffect(() => {
        doSearch();
    }, []);

    /**
     * Onchange form
     */
     const onChange = async (fieldName: string, evt: any, value: any) => {
        const _temp = _.cloneDeep(values) as any;
        _temp[fieldName] = value;
        props.handleUpdateFormSearch && props.handleUpdateFormSearch(_temp);
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    };
    return (
        <>
            <div className='panel panel-default'>
                <div className="panel-body">
                    <form onSubmit={(e) => CommonUtil.focusOnSubmitError(e, handleSubmit)}>
                        <div className="row">
                            <div className="col-12 col-md-3">
                                <BaseTextControl
                                    labelKey="Mã đơn hàng"
                                    property='orderCode'
                                    initialValue={_.get(values, 'orderCode')}
                                    callbackValueChange={onChange}
                                />
                            </div>
                            <div className="col-12 col-md-3">
                                <BaseTextControl
                                    labelKey="Số điện thoại KH"
                                    property='phoneNumber'
                                    initialValue={_.get(values, 'phoneNumber')}
                                    callbackValueChange={onChange}
                                />
                            </div>
                            <div className="col-12 col-md-3">
                                <BaseTextControl
                                    labelKey="Khách hàng"
                                    property='fullName'
                                    initialValue={_.get(values, 'fullName')}
                                    callbackValueChange={onChange}
                                />
                            </div>
                            <div className="col-12 col-md-3">
                                <BaseDropdownControl
                                    labelKey="Trạng thái đơn hàng"
                                    property='status'
                                    options={STATUS_ORDERS}
                                    optionValue='id'
                                    optionLabel='name'
                                    initialValue={_.get(values, 'status')}
                                    callbackValueChange={onChange}
                                />
                            </div>
                            <div className="col-12 col-md-3">
                                <BaseDropdownControl
                                    labelKey="Trạng thái thanh toán"
                                    property='paymentStatus'
                                    options={PAYMENTS_STATUS}
                                    optionValue='id'
                                    optionLabel='name'
                                    initialValue={_.get(values, 'paymentStatus')}
                                    callbackValueChange={onChange}
                                />
                            </div>
                        </div>
                        {footer}
                    </form>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
});

const mapDispatchToProps = {
    handleSearchOrderReturn,
    handleUpdateFormSearch
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderReturnSearch);

