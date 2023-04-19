import { useState, ChangeEvent } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { handleSearchProduct } from 'src/reducers/product.reducer';
import ProductAddAction from './product-add-action';
import ProductForm from './product-form';
// import * as XLSX from "xlsx";
type IProductIndexProps = StateProps & DispatchProps & {
}

const ProductAddIndex = (props: IProductIndexProps) => {
    let refInputImport = null;
    const [showDialog, setShowDialog] = useState(false);
    const [productId, setProductId] = useState(null);
    const [importFile, setImportFile] = useState(null);

    const afterSaveSuccess = () => {
        setShowDialog(false);
        setProductId(null);
        props.handleSearchProduct(props.formSearch);
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
                <ProductAddAction
                    onImportExcel={onImportExcel}
                />
                <ProductForm
                    afterSaveSuccess={afterSaveSuccess}
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
    handleSearchProduct
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductAddIndex);
