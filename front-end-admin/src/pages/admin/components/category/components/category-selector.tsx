import { InputText } from 'primereact/inputtext';
import { forwardRef, useEffect, useState } from 'react';
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/reducers';
import { DataTable, DataTablePFSEvent } from 'primereact/datatable';
import { translate } from 'react-jhipster';
import { Column } from 'primereact/column';
import useDebounce from 'src/utils/useDebounce';
import { ICategoryControlProps } from './category-control';
import CategoryService from 'src/services/category.services';
import { Button } from 'primereact/button';
import { Tree } from 'primereact/tree';
import { Panel } from 'primereact/panel';

type ICategorySelectorProps = StateProps & DispatchProps & ICategoryControlProps &{
    onSelected?: (rowData: any) => void;
}

const CategorySelector = forwardRef((props: ICategorySelectorProps, ref: any) => {
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);
    const [configTable, setConfigTable] = useState({}) as any;
    const [datasource, setDatasource] = useState({}) as any;
    const debouncedCode = useDebounce(code, 1000);
    const debouncedName = useDebounce(name, 1000);

    const convertTreeNode = (listOrg: Array<any>) => {
        if (!listOrg) {
            return [];
        }
        return listOrg.map((e, idx) => ({
            ...e,
            key: e.id,
            label: e.name,
            leaf: e.numberChild == 0,
            icon: e.numberChild == 0 ? 'pi pi-file' : 'pi pi-folder-open'
        }));
    }

    useEffect(() => {
        const loadDatasource = async () => {
            await CategoryService.initTreeCategory().then((res: any) => {
                setTreeData(convertTreeNode(res?.data?.data));
            });
            await doSearch();
        }
        loadDatasource();
    }, []);

    useEffect(() => {
        doSearch();
    }, [selectedOrg]);

    useEffect(() => {
        if (!debouncedCode && !debouncedName) {
          return;
        }
        doSearch();
    }, [debouncedCode, debouncedName])

    /**
     * Tìm kiếm
     */
    const doSearch = async (event?) => {
        const formData = {
            code: code,
            name: name,
            id: selectedOrg ? selectedOrg.id : null
        }
        await CategoryService.search(formData, event).then((res: any) => {
            setDatasource(res?.data?.data);
        });
    }

    /**
     * lazyLoadTree
     * @param event
     */
    const loadOnExpand = async (event: any) => {
        if (!event.node.children) {
            setLoading(true);
            const formData = {
                parentId: event.node.id
            };
            await CategoryService.lazyLoadTree(formData).then((res: any) => {
                event.node.children = convertTreeNode(res?.data?.data);
                setLoading(false);
            })
        }
    }

    /**
     * Chuyển trang
     * @param event
     */
     const onPage = (event) => {
        setConfigTable(event);
        doSearch(event);
    }

    /**
     * Sort
     * @param event
     */
    const onSort = (event) => {
        setConfigTable(event);
        doSearch(event);
    }

    /**
     * Chọn đơn vị
     * @param rowData
     */
    const onSelected = (rowData) => {
        props.onSelected && props.onSelected(rowData);
    }

    const onSelectionChange = (e) => {
        setSelectedOrg(e.node);
    }

    const templateHeader = (options) => {
        const className = `${options.className} p-1 rol`;

        return (
            <form className={className} id="formOrgSelector">
                <div className="col-6 p-0 pr-1">
                    <InputText value={code} onChange={(e) => setCode(e.target.value)} className="w-100" placeholder={translate('orgSelector.inputCode')}/>
                </div>
                <div className="col-6 p-0">
                    <div className="p-inputgroup">
                        <InputText value={name} onChange={(e) => setName(e.target.value)} placeholder={translate('orgSelector.inputName')}/>
                        <Button type="button" form="formOrgSelector" icon="pi pi-search" className="p-button-warning" onClick={() => doSearch()}/>
                    </div>
                </div>
            </form>
        )
    }

    const templateSelect = (rowData: any) => {
        return <>
            <a data-tip={translate('orgSelector.select')} onClick={() => onSelected(rowData)}><i className="icon-action pi pi-check"></i></a>
        </>;
    };


    return (
        <>
            <div className="d-flex category-selector-dialog">
                <div className="tree-category">
                    <Tree value={treeData} selectionMode="single" onExpand={loadOnExpand} loading={loading}
                        selectionKeys={selectedKey}
                        onSelectionChange={e => setSelectedKey(e.value)}
                        onSelect={onSelectionChange}
                    />
                </div>
                <div className="flex-fill pl-4">
                    <Panel headerTemplate={templateHeader}>
                        <DataTable value={datasource?.data} totalRecords={datasource?.recordTotal * 1} first={datasource?.first * 1} rows={10} lazy
                            responsiveLayout="scroll" stripedRows showGridlines size="small"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            currentPageReportTemplate={translate('common.currentPageReportTemplate') || `({currentPage} of {totalPages})`} paginator={datasource?.data?.length > 0}
                            emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField} sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}>
                            <Column header={translate('orgSelector.select')} className="text-center" style={{ width: '50px' }} body={templateSelect}></Column>
                            <Column field="code" header={translate('orgSelector.code')} sortable style={{ width: '150px' }}></Column>
                            <Column field="name" header={translate('orgSelector.name')} sortable style={{ width: '200px' }}></Column>
                        </DataTable>
                    </Panel>
                </div>
            </div>
        </>
    );
});

CategorySelector.displayName = 'CategorySelector';

CategorySelector.defaultProps = {
};

const mapStateToProps = ({ }: IRootState) => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;
const options = { forwardRef: true };
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
)(CategorySelector);

