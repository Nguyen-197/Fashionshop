import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Toast } from 'src/components/toast/toast.utils';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util'
import { handleSearchUser } from 'src/reducers/customer.reducer';
import UserService from 'src/services/user.services';
import UserAction from './user-action';
import UserForm from './user-form';
import UserList from './user-list';
import UserSearch from './user-search';
import * as XLSX from "xlsx"
type ICustomerIndexProps = StateProps & DispatchProps & {
}

const CustomerIndex = (props: ICustomerIndexProps) => {
    let refInputImport = null;
    const [showDialog, setShowDialog] = useState(false);
    const [userId, setUserId] = useState(null);
    const customerFormRef = useRef<any>(null);
    const onAdd = () => {
        setShowDialog(true);
    }

    const onEdit = (rowData) => {
        setUserId(rowData.id);
        setShowDialog(true);
    }

    const onDelete = async (rowData) => {
        let message = "Bạn có chắc chắn muốn mở hoạt động người dùng này không ?";
        if (rowData.active) {
            message = "Bạn có chắn chắn muốn ngừng hoạt động người dùng này không ?";
        }
        await CommonUtil.confirmDelete(async () => {
            await UserService.delete(rowData.id).then(() => {
                Toast.success(translate('common.deleted'));
                props.handleSearchUser(props.formSearch);
            });
        }, null, message);
    }

    const afterSaveSuccess = () => {
        setShowDialog(false);
        setUserId(null);
        props.handleSearchUser(props.formSearch);

    }

    const onHide = () => {
        setShowDialog(false);
        setUserId(null);
    }

    const onImportExcel = () => {
        if (refInputImport) {
            refInputImport.click();
        }
    }

    const toCapitalize = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // const handleFile = async (ev: ChangeEvent<HTMLInputElement>) => {
    //     const file = ev.target.files[0];
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const wb = XLSX.read(e.target.result, { type: 'array' });
    //         const wsname = wb.SheetNames[0];
    //         const ws = wb.Sheets[wsname];
    //         const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    //         const cols: any = data[0];
    //         data.shift();

    //         let _importedCols = cols.map(col => ({ field: col, header: toCapitalize(col) }));
    //         let _importedData = data.map(d => {
    //             return cols.reduce((obj, c, i) => {
    //                 obj[c] = d[i];
    //                 return obj;
    //             }, {});
    //         });
    //         console.log(">>> _importedCols: ", _importedCols);
    //         console.log(">>> _importedData: ", _importedData)
    //     }
    //     reader.readAsArrayBuffer(file);
    //     setImportFile(ev.target.files[0])
    // }

    return (
        <>
            <section className="content">
                {/* <input id="file-export" ref={input => { refInputImport = input }} type="file" hidden accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={e => handleFile(e)} /> */}
                <UserAction
                    onAdd={onAdd}
                />
                <UserSearch />
                <UserList
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </section>
            {showDialog && <UserForm
                userId={userId}
                onHide={onHide}
                ref={customerFormRef}
                afterSaveSuccess={afterSaveSuccess}
            />}
        </>
    )
}

const mapStateToProps = ({ customerReducerState, locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
    formSearch: customerReducerState.formSearch
});

const mapDispatchToProps = {
    handleSearchUser
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerIndex);
