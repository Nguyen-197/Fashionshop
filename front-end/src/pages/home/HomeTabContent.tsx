import {useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Product from 'src/components/product';
import { IRootState } from 'src/reducers';
import { Paginator } from 'primereact/paginator';
import CategoryService from 'src/services/category.services';
import SizeService from 'src/services/size.services';
import ColorService from 'src/services/color.services';
import { Tree } from 'primereact/tree';
type HomeTabContent = StateProps & DispatchProps & {
    products: any;
    formSearch?: any;
    height?: number;
    onChangePage?: Function;
}

const HomeTabContent = (props: HomeTabContent) => {
    const products = props.products;
    const [treeData, setTreeData] = useState([]);
    const [treeDataSize, setTreeDataSize] = useState([]);
    const [treeDataColor, setTreeDataColor] = useState([]);
    const [dataSearch, setDataSearch] = useState({});
    const [loading, setLoading] = useState(false);
    const [basicRows, setBasicRows] = useState(8);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectedKeySize, setSelectedKeySize] = useState(null);
    const [selectedKeyColor, setSelectedKeyColor] = useState(null);
    // const [datasource, setDatasource] = useState({}) as any;
    const convertTreeNode = (listOrg: Array<any>) => {
        if (!listOrg) {
            return [];
        }
        return listOrg.map((e, idx) => ({
            ...e,
            key: e.code,
            label: e.name,
            leaf: e?.numberChild == 0,
        }));
    }
    const onPageChange = async (event) => {
        const eventConfig = {
            first: event.first,
            rows: event.rows,
            page: event.page,
            pageCount: event.pageCount,
        }
        await props.onChangePage && props.onChangePage({}, eventConfig);
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
    const onChange = (e) => {
        setSelectedKey(e.value)
        const arr = Object.keys(e.value).filter(key => {
            if(e.value[key].checked || e.value[key].partialChecked) {
                return key
            }
        })
        const form = Object.assign({} , dataSearch, {listProductCategory: [...arr]})
        setDataSearch(form)
    }
    const onChangeSize= (e) => {
        setSelectedKeySize(e.value)
        const arr = Object.keys(e.value).filter(key => {
            if(e.value[key].checked) {
                return key
            }
        })
        console.log(arr);
        const form = Object.assign({} , dataSearch , {listProductSize: [...arr]})
        setDataSearch(form)
    }
    const onChangeColor = (e) => {
        setSelectedKeyColor(e.value)
        const arr = Object.keys(e.value).filter(key => {
            if(e.value[key].checked) {
                return key
            }
        })
        const form = Object.assign({} , dataSearch, {listProductColor: [...arr]})
        setDataSearch(form)
    }
    useEffect(() => {
        props.formSearch(dataSearch)
    }, [dataSearch] )
    useEffect(() => {
        const loadDatasource = async () => {
            await CategoryService.initTreeOrg().then((res: any) => {
                setTreeData(convertTreeNode(res?.data?.data));
            });
            await SizeService.findAll().then((res: any) => {
                const dataSize = res?.data?.data.map((item: any) => {
                    item.numberChild = 0
                    return item
                })
                setTreeDataSize(convertTreeNode(dataSize))
            })
            await ColorService.findAll().then((res: any) => {
                const dataColor = res?.data?.data.map((item: any) => {
                    item.numberChild = 0
                    return item
                })
                setTreeDataColor(convertTreeNode(dataColor))
            })
        }
        loadDatasource();
    }, [])
    return (
        <>
        <div className="d-flex">
            <div className="ml-4">
                <h3>
                    <i className="pi pi-filter-fill mr-3" style={{'fontSize': '0.9em'}}></i>
                    Bộ lọc tìm kiếm
                </h3>
                <div>
                    Lọc theo danh mục
                </div>
                <div className="tree-category">
                    <Tree value={treeData} selectionMode="checkbox" onExpand={loadOnExpand} loading={loading}
                        selectionKeys={selectedKey}
                        onSelectionChange={e => onChange(e)}
                    />
                </div>
                <div>
                    Lọc theo kích cỡ
                </div>
                <div className="tree-size">
                    <Tree value={treeDataSize} selectionMode="checkbox" onExpand={loadOnExpand} loading={loading}
                        selectionKeys={selectedKeySize}
                        onSelectionChange={e => onChangeSize(e)}
                    />
                </div>
                <div>
                    Lọc theo màu
                </div>
                <div className="tree-size">
                    <Tree value={treeDataColor} selectionMode="checkbox" onExpand={loadOnExpand} loading={loading}
                        selectionKeys={selectedKeyColor}
                        onSelectionChange={e => onChangeColor(e)}
                    />
                </div>
            </div>
            <div className="container" style={{ marginBottom: '50px' }}>
                <div>
                    <div className="row">
                        { products?.data?.map((item, index) => {
                            return (
                                <div className="col-3" key={item.id}>
                                    <Product
                                        key={index}
                                        product={item}
                                    />
                                </div>
                            )
                        })}
                        {
                            products?.data?.length === 0 &&
                            <div style={{
                                textAlign: 'center',
                                width: '100%',
                                textTransform: 'capitalize',
                                marginTop: '150px'
                            }}>
                                there's nothing here yet
                            </div>
                        }
                    </div>
                    <div className="flex-center">
                        { products?.recordTotal > basicRows && <div className="">
                            <Paginator first={products?.first|| 0} rows={basicRows} totalRecords={products?.recordTotal || 0} onPageChange={onPageChange}></Paginator>
                        </div> }
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
const mapStateToProps = ({  authentication }: IRootState) => ({
    isLoading: authentication.isLoading,
});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(HomeTabContent);