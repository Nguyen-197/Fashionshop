import { useState, useRef, ChangeEvent } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Toast } from 'src/components/toast/toast.utils';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import { handleSearchColor } from 'src/reducers/color.reducer';
import ColorService from 'src/services/color.services';
import ColorForm from './color-form';
import ColorList from './color-list';
import ColorSearch from './color-search';
import ColorAction from './color-action';
import { RESPONSE_TYPE } from 'src/enum';
// import * as XLSX from "xlsx";
type IColorIndexProps = StateProps & DispatchProps & {
}

const ColorIndex = (props: IColorIndexProps) => {
	let refInputImport = null;
    const [showDialog, setShowDialog] = useState(false);
    const [colorId, setColorId] = useState(null);
	const [importFile, setImportFile] = useState(null);

    const onAdd = () => {
        setShowDialog(true);
    }

    const onEdit = (rowData) => {
        setColorId(rowData.id);
        setShowDialog(true);
    }

    const onDelete = async (rowData) => {
        await CommonUtil.confirmDelete(async () => {
            const response = await ColorService.delete(rowData.id)
            if (response.data.type == RESPONSE_TYPE.SUCCESS) {
                props.handleSearchColor(props.formSearch);
            }
        })
    }

    const afterSaveSuccess = () => {
        setShowDialog(false);
        setColorId(null);
        props.handleSearchColor(props.formSearch);
    }

    const onHide = () => {
        setShowDialog(false);
        setColorId(null);
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
                <ColorAction
                    onAdd={onAdd}
                    onImportExcel={onImportExcel}
                />
                <ColorSearch />
                <ColorList
                    onAdd={onAdd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </section>
            {showDialog && <ColorForm
                colorId={colorId}
                onHide={onHide}
                afterSaveSuccess={afterSaveSuccess}
            />}
        </>
    )
}

const mapStateToProps = ({ colorReducerState, locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
    formSearch: colorReducerState.formSearch
});

const mapDispatchToProps = {
    handleSearchColor
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorIndex);
