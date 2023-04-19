
import { Button } from 'primereact/button';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { translate } from 'react-jhipster';
import { useFormik } from 'formik';
import BaseTextControl from 'src/app/components/BaseTextControl';
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import { CommonUtil } from 'src/utils/common-util';
import _ from 'lodash';
import BaseDateControl from 'src/app/components/BaseDateControl';
import { SALE_OFF_STATUS } from 'src/@types/constants';
type ISaleOffSearchProps = StateProps & DispatchProps & {
    handleSearch?: Function,
    handleUpdateFormSearch?: Function;
    handleUpdateConfigTable?: Function;
}

const SaleOffSearch = (props: ISaleOffSearchProps) => {
    const {
        values,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {
            // orderCode: "",
            // idUser: "",
            // status: "",
            // paymentStatus: ""
        },
        onSubmit: async (data: any) => {
            await doSearch(data);
        },
    });
    /**
     * Action t�m ki?m
     */
    const doSearch = (data?) => {
        props.handleSearch && props.handleSearch(data);
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
                                    labelKey="Mã khuyến mại"
                                    property='code'
                                    initialValue={_.get(values, 'code')}
                                    callbackValueChange={onChange}
                                />
                            </div>
                            <div className="col-12 col-md-3">
                                <BaseTextControl
                                    labelKey="Tên khuyến mại"
                                    property='name'
                                    initialValue={_.get(values, 'name')}
                                    callbackValueChange={onChange}
                                />
                            </div>
                            <div className="col-12 col-md-3">
                                <BaseDateControl
                                    labelKey="Ngày hiệu lực"
                                    property='startDate'
                                    initialValue={_.get(values, 'startDate')}
                                    callbackValueChange={onChange}
                                />
                            </div>
                            <div className="col-12 col-md-3">
                                <BaseDateControl
                                    labelKey="Ngày kết thúc"
                                    property='endDate'
                                    initialValue={_.get(values, 'endDate')}
                                    callbackValueChange={onChange}
                                />
                            </div>
                            <div className="col-12 col-md-3">
                                <BaseDropdownControl
                                    labelKey="Trạng thái"
                                    property='isActive'
                                    options={SALE_OFF_STATUS}
                                    optionLabel="name"
                                    optionValue="id"
                                    initialValue={_.get(values, 'isActive')}
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
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SaleOffSearch);