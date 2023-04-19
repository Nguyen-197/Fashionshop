import { useState, useRef, ChangeEvent } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Toast } from 'src/components/toast/toast.utils';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util'
import { handleSearchUser } from 'src/reducers/user.reducer';
import UserService from 'src/services/user.services';
import UserAction from '../components/user-action';
import UserForm from './user-form';
import UserList from './user-list';
import UserSearch from './user-search';
import * as XLSX from "xlsx"
type IUserIndexProps = StateProps & DispatchProps & {
}

const UserIndex = (props: IUserIndexProps) => {
    let refInputImport = null;
    const [showDialog, setShowDialog] = useState(false);
    const [userId, setUserId] = useState(null);
    const userFormRef = useRef<any>(null);
    const [importFile, setImportFile] = useState(null);
    // const refInputImport = useRef();
    const onAdd = () => {
        setShowDialog(true);
    }

    const onEdit = (rowData) => {
        setUserId(rowData.id);
        setShowDialog(true);
    }

    const onDelete = (rowData) => {
        CommonUtil.confirmDelete(() => {
            UserService.delete(rowData.id).then(() => {
                Toast.success(translate('common.deleted'));
                props.handleSearchUser(props.formSearch);
            });
        })
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
                ref={userFormRef}
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
    handleSearchUser
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserIndex);
