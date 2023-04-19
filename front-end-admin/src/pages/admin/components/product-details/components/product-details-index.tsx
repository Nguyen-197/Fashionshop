import { useState, useRef, ChangeEvent } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Toast } from 'src/components/toast/toast.utils';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { handleSearchProductDetails } from 'src/reducers/product-details.reducer';
import ProductDetailsService from 'src/services/product-details.services';
import ProductDetailsList from './product-details-list';
// import * as XLSX from "xlsx";;
import { useHistory } from 'react-router';
type IProductDetailsIndexProps = StateProps & DispatchProps & {
}

const ProductDetailsIndex = (props: IProductDetailsIndexProps) => {
    const history = useHistory();
    let refInputImport = null;
    const [showDialog, setShowDialog] = useState(false);
    const [productId, setProductId] = useState(null);
    const [importFile, setImportFile] = useState(null);
    const onAdd = () => {
        setShowDialog(true);
    }

    const onEdit = (rowData) => {
        productId(rowData.id);
        history.push(`/admin/product-details/${rowData.id}`);
    }

    const onDelete = (rowData) => {
        CommonUtil.confirmDelete(() => {
            ProductDetailsService.delete(rowData.id).then(() => {
                Toast.success(translate('common.deleted'));
                props.handleSearchProductDetails(props.formSearch);
            });
        })
    }

    const afterSaveSuccess = () => {
        setShowDialog(false);
        setProductId(null);
        props.handleSearchProductDetails(props.formSearch);
    }

    const onHide = () => {
        setShowDialog(false);
        productId(null);
    }

    const onImportExcel = () => {
        if (refInputImport) {
            refInputImport.click();
        }
    }

    const toCapitalize = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    const handleFile = async (ev: ChangeEvent<HTMLInputElement>) => {
        // const file = ev.target.files[0];
        // const reader = new FileReader();
        // reader.onload = (e) => {
        //     const wb = XLSX.read(e.target.result, { type: 'array' });
        //     const wsname = wb.SheetNames[0];
        //     const ws = wb.Sheets[wsname];
        //     const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        //     const cols: any = data[0];
        //     data.shift();

        //     let _importedCols = cols.map(col => ({ field: col, header: toCapitalize(col) }));
        //     let _importedData = data.map(d => {
        //         return cols.reduce((obj, c, i) => {
        //             obj[c] = d[i];
        //             return obj;
        //         }, {});
        //     });
        //     console.log(">>> _importedCols: ", _importedCols);
        //     console.log(">>> _importedData: ", _importedData)
        // }
        // reader.readAsArrayBuffer(file);
        // setImportFile(ev.target.files[0])
    }

    return (
        <>
            <section className="content">
                <input id="file-export" ref={input => { refInputImport = input }} type="file" hidden accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={e=> handleFile(e)} />
                <ProductDetailsList
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </section>
        </>
    )
}

const mapStateToProps = ({ productReducerState, locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
    formSearch: productReducerState.formSearch
});

const mapDispatchToProps = {
    handleSearchProductDetails
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductDetailsIndex);
