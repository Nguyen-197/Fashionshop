import { useState, useRef, ChangeEvent } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Toast } from 'src/components/toast/toast.utils';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { handleSearchCategories } from 'src/reducers/category.reducer';
import CategoryService from 'src/services/category.services';
import CategoryAction from './category-action';
import CategoryForm from './category-form';
import CategoryList from './category-list';
import CategorySearch from './category-search';
import { RESPONSE_TYPE } from 'src/enum';
// import * as XLSX from "xlsx";
type ICategoryIndexProps = StateProps & DispatchProps & {
}

const CategoryIndex = (props: ICategoryIndexProps) => {
    let refInputImport = null;
    const [showDialog, setShowDialog] = useState(false);
    const [categoryId, setCategoryId] = useState(null);

    const onAdd = () => {
        setShowDialog(true);
    }

    const onEdit = (rowData) => {
        setCategoryId(rowData.id);
        setShowDialog(true);
    }

    const onDelete = async (rowData) => {
        await CommonUtil.confirmDelete(async () => {
            const response = await CategoryService.delete(rowData.id);
            if (response.data.type == RESPONSE_TYPE.SUCCESS) {
                props.handleSearchCategories(props.formSearch);
            }
        }, null, "Bạn có chắn chắc muốn xóa danh mục này không ?");
    }

    const afterSaveSuccess = () => {
        setShowDialog(false);
        setCategoryId(null);
        props.handleSearchCategories(props.formSearch);
    }

    const onHide = () => {
        setShowDialog(false);
        setCategoryId(null);
    }

    return (
        <>
            <section className="content">
                <CategoryAction
                    onAdd={onAdd}
                    onImportExcel={() => {}}
                />
                <CategorySearch />
                <CategoryList
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </section>
            {showDialog && <CategoryForm
                categoryId={categoryId}
                onHide={onHide}
                afterSaveSuccess={afterSaveSuccess}
            />}
        </>
    )
}

const mapStateToProps = ({ categoryReducerState, locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
    formSearch: categoryReducerState.formSearch
});

const mapDispatchToProps = {
    handleSearchCategories
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryIndex);
