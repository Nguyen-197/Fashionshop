import { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { handleSearchProduct } from 'src/reducers/product.reducer';
import ProductAction from './product-action';
import ProductList from './product-list';
import ProductSearch from './product-search';
import { useHistory } from 'react-router';
import ProductForm from './product-form';
import ProductFormExport from './product-form-export';
import { BUSSINESS_TYPE, RESPONSE_TYPE } from 'src/enum';
import productServices from 'src/services/product.services';
type IProductIndexProps = StateProps & DispatchProps & {
}

const ProductIndex = (props: IProductIndexProps) => {
    const history = useHistory();
    const productFormRef = useRef<any>(null);
    const [showProductForm, setShowProductForm] = useState(false);
    const [productId, setProductId] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    const [showFormExport, setShowFormExport] = useState(false);

    const onAdd = () => {
        setViewMode(false);
        setShowProductForm(true);
    }

    const onExportExcel = () => {
        setShowFormExport(true);
    }

    const onHide = () => {
        setShowProductForm(false);
        setViewMode(false);
        setProductId(null);
    }

    const onView = (rowData) => {
        setShowProductForm(true);
        setViewMode(true);
        setProductId(rowData.id);
    }

    const onEdit = (rowData) => {
        setViewMode(false);
        setShowProductForm(true)
        setProductId(rowData.id);
    }

    const onHideFormExport = () => {
        setShowFormExport(false)
    }

    const onChangeBussiness = async (rowData, status) => {
        let message = "Bạn có chắn chắn muốn ngừng kinh doanh sản phẩm này không ?";
        if (status == BUSSINESS_TYPE.CONTINUE) {
            message = "Bạn có chắn chắn muốn mở kinh doanh lại sản phẩm này không ?";
        }
        await CommonUtil.confirmDelete(async () => {
            const response = await productServices.changeBussiness(rowData.id);
            if (response.data.type === RESPONSE_TYPE.SUCCESS) {
                await props.handleSearchProduct(props.formSearch);
            }
        }, null, message);
    }

    const afterSaveSuccess = async () => {
        setViewMode(false);
        setShowProductForm(false);
        setProductId(null);
        await props.handleSearchProduct(props.formSearch);
    }

    return (
        <>
            <section className="content">
                <ProductAction
                    onAdd={onAdd}
                    onExportExcel={onExportExcel}
                />
                <ProductSearch />
                <ProductList
                    onView={onView}
                    onEdit={onEdit}
                    onChangeBussiness={onChangeBussiness}
                />
            </section>
            {showProductForm &&
                <ProductForm
                    ref={productFormRef}
                    productId={productId}
                    viewMode={viewMode}
                    onHide={onHide}
                    afterSaveSuccess={afterSaveSuccess}
                />
            }

            {showFormExport &&
                <ProductFormExport
                    onHideFormExport={onHideFormExport}
                    />
            }
        </>
    )
}

const mapStateToProps = ({ productReducerState, locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
    formSearch: productReducerState.formSearch
});

const mapDispatchToProps = {
    handleSearchProduct
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductIndex);
