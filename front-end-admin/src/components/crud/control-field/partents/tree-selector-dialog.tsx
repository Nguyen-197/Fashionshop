
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from '../../../../reducers';
import { Tree } from 'primereact/tree';
import TreeSelectorService from '../../../../services/tree-selector.services';
import _ from 'lodash';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { translate } from 'react-jhipster';
import useDebounce from '../../../../utils/useDebounce';
import { CommonUtil } from '../../../../utils/common-util';

type ITreeSelectorDialogProps = StateProps & DispatchProps & {
    onSelected?: (org) => void;
    treeSelectorOptions: any;
}

const TreeSelectorDialog = (props: ITreeSelectorDialogProps) => {
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);
    const [configTable, setConfigTable] = useState({}) as any;
    const [datasource, setDatasource] = useState({}) as any;
    const debouncedSearch = useDebounce(search, 1000);

    const convertTreeNode = (list: Array<any>) => {
        if (!list) {
            return [];
        }
        return list.map((e, idx) => ({
            ...e,
            key: e.id,
            label: e[props.treeSelectorOptions.nameField],
            leaf: e.numberChild == 0,
            icon: e.numberChild == 0 ? 'pi pi-file' : 'pi pi-folder-open'
        }));
    }

    useEffect(() => {
        TreeSelectorService.lazyLoadTree(null, props.treeSelectorOptions).then((res: any) => {
            setTreeData(convertTreeNode(res?.data?.rows));
        });
        doSearch();
    }, []);

    useEffect(() => {
        doSearch();
    }, [selectedOrg]);

    useEffect(() => {
        if (!debouncedSearch) {
          return;
        }
        doSearch();
    }, [debouncedSearch])

    /**
     * Tìm kiếm
     */
    const doSearch = (event?) => {
        const formData = {
            search: search,
            parentId: selectedOrg ? selectedOrg.id : null,
            treeSelectorOptions: props.treeSelectorOptions
        }
        TreeSelectorService.searchGrid(formData, event).then((res: any) => {
            setDatasource(res?.data);
        });
    }

    /**
     * lazyLoadTree
     * @param event
     */
    const loadOnExpand = (event: any) => {
        if (!event.node.children) {
            setLoading(true);
            TreeSelectorService.lazyLoadTree(event.node.id, props.treeSelectorOptions).then((res: any) => {
                event.node.children = convertTreeNode(res?.data?.rows);
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
                <div className="col-12 p-0">
                    <div className="p-inputgroup">
                        <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder={props.treeSelectorOptions?.searchConditions?.placeholder}/>
                        <Button type="button" form="formOrgSelector" icon="pi pi-search" className="p-button-warning" onClick={() => doSearch()}/>
                    </div>
                </div>
            </form>
        )
    }

    const templateSelect = (rowData) => {
        return <>
            <a data-tip={translate('orgSelector.select')} title={translate('orgSelector.select')} onClick={() => onSelected(rowData)}><i className="icon-action pi pi-check"></i></a>
        </>
    }
    const dynamicColumns = props.treeSelectorOptions.gridFields.map(el => {
        if (el.type == 'date') {
            return <Column key={el.column} field={el.column} header={el.label} style={el.style} sortable body={CommonUtil.renderDateColumn} className="text-center"></Column>
        }
        return <Column key={el.column} field={el.column} header={el.label} style={el.style} sortable></Column>
    })
    return (
        <>
            <div className="d-flex org-selector-dialog">
                <div className="tree-org">
                    <Tree value={treeData} selectionMode="single" onExpand={loadOnExpand} loading={loading}
                        selectionKeys={selectedKey}
                        onSelectionChange={e => setSelectedKey(e.value)}
                        onSelect={onSelectionChange}
                    />
                </div>
                <div className="flex-fill pl-4">
                    <Panel headerTemplate={templateHeader}>
                        <DataTable value={datasource?.list} totalRecords={datasource?.total} first={datasource?.first} rows={10} lazy
                            responsiveLayout="scroll" stripedRows showGridlines size="small"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            currentPageReportTemplate={translate('common.currentPageReportTemplate') || `({currentPage} of {totalPages})`} paginator={datasource?.list?.length > 0}
                            emptyMessage={translate('common.dataNotFound')} sortField={configTable.sortField} sortOrder={configTable.sortOrder} onSort={onSort} onPage={onPage}>
                            <Column header={translate('orgSelector.select')} className="text-center" style={{ width: '50px' }} body={templateSelect}></Column>
                            {dynamicColumns}
                        </DataTable>
                    </Panel>
                </div>
            </div>

        </>
    )
}

const mapStateToProps = ({ }: IRootState) => ({

});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TreeSelectorDialog);
