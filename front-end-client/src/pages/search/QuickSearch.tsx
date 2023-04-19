import { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { setLoading } from 'src/reducers/authentication';
import * as IoIcon from "react-icons/io";
import * as IoIcon5 from "react-icons/io5";
import useDebounce from 'src/utils/useDebounce';
import productServices from 'src/services/product.services';
import { RESPONSE_TYPE } from 'src/@types/enums';
import { ProductItem } from 'src/models/Product';
import Product from 'src/components/product';
import { Paginator } from 'primereact/paginator';
import categoryServices from 'src/services/category.services';
import { Tree } from 'primereact/tree';
import sizeServices from 'src/services/size.services';
import colorServices from 'src/services/color.services';
type IQuickSearchProps = StateProps & DispatchProps & {
    searchOpen?: boolean;
    clickToClose?: Function;
}

const QuickSearch = (props: IQuickSearchProps) => {
    const [basicRows, setBasicRows] = useState(8);
    const [productSearch, setProductSearch] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);
    const [treeDataSize, setTreeDataSize] = useState([]);
    const [selectedKeySize, setSelectedKeySize] = useState(null);
    const [treeDataColor, setTreeDataColor] = useState([]);
    const [selectedKeyColor, setSelectedKeyColor] = useState(null);
    const [dataSearch, setDataSearch] = useState({});
    const debouncedSearch = useDebounce(dataSearch, 1000);
    const convertTreeNode = (listOrg: Array<any>) => {
        if (!listOrg) {
            return [];
        }
        return listOrg.map((e, idx) => ({
            ...e,
            key: e.id,
            label: e.name,
            leaf: e.numberChild == 0,
        }));
    }
    const onPageChange = async (event) => {
        const eventConfig = {
            first: event.first,
            rows: event.rows,
            page: event.page,
            pageCount: event.pageCount,
        }
        await doSearch(eventConfig);
    }
    const doSearch = async (event?) => {
        const formData = {
            name: searchInput,
            ...dataSearch
        }
        const search = await productServices.search(formData, event);
        if (search.data.type == RESPONSE_TYPE.SUCCESS) {
            const searchData = search.data.data;
            setProductSearch(searchData);
        }
    };
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchInput(value);
    };
    const handleRemoveSeachInput = () => {
        setSearchInput("");
        setProductSearch(null);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        await doSearch();
    }
    useEffect(() => {
        const loadDatasource = async () => {
            await sizeServices.findAll().then((res: any) => {
                const dataSize = res?.data?.data.map((item: any) => {
                    item.numberChild = 0
                    return item
                })
                setTreeDataSize(convertTreeNode(dataSize))
            })
            await colorServices.findAll().then((res: any) => {
                const dataColor = res?.data?.data.map((item: any) => {
                    item.numberChild = 0
                    return item
                })
                setTreeDataColor(convertTreeNode(dataColor))
            })
        }
        loadDatasource();
    }, []);
    useEffect(() => {
        if (!debouncedSearch) {
          return;
        }
        doSearch();
    }, [debouncedSearch]);
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
            await categoryServices.lazyLoadTree(formData).then((res: any) => {
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
        const form = Object.assign({} , dataSearch, { listProductCategory: [...arr] })
        setDataSearch(form)
    }
    const onChangeSize= (e) => {
        setSelectedKeySize(e.value)
        const arr = Object.keys(e.value).filter(key => {
            if(e.value[key].checked) {
                return key
            }
        })
        const form = Object.assign({} , dataSearch , { listProductSize: [...arr] })
        setDataSearch(form)
    }
    const onChangeColor = (e) => {
        setSelectedKeyColor(e.value)
        const arr = Object.keys(e.value).filter(key => {
            if(e.value[key].checked) {
                return key
            }
        })
        const form = Object.assign({} , dataSearch, { listProductColor: [...arr] })
        setDataSearch(form)
    }
    return (
        <>
            <div className={props.searchOpen ? "header-search fadeGrow" : "header-search displayNone"}>
                <div className="search-heading flex">
                    <div className="search-title">Search</div>
                    <div className="search-close">
                        <IoIcon.IoMdClose
                            onClick={() => props.clickToClose()}
                            className="close"
                        />
                    </div>
                </div>
                <div className={props.searchOpen === false ? "" : "fadeIn"}>
                    <div className="search-form">
                        <form className="flex" onSubmit={onSubmit}>
                            <IoIcon5.IoSearch className="search-icon" />
                            <input
                                type="text"
                                id="search"
                                placeholder="Search"
                                value={searchInput}
                                onChange={handleSearch}
                            />
                            <IoIcon.IoMdClose className="close-icon" onClick={handleRemoveSeachInput}/>
                        </form>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <h3>
                                <i className="pi pi-filter-fill mr-3" style={{'fontSize': '0.9em'}}></i>
                                Bộ lọc tìm kiếm
                            </h3>
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
                        <div className="col-10">
                            <div className="search-results">
                                { productSearch?.data?.length > 0 ?
                                    <div className="row product-list">
                                        { productSearch.data.map(item => {
                                            return (
                                                <div className="col-3" key={item.id}>
                                                    <Product
                                                        key={item.id}
                                                        product={item}
                                                    />
                                                </div>
                                            );
                                        }) }
                                    </div> : <span className="flex-center">Không có kết quả tìm kiếm</span>
                                }
                            </div>
                            <div className="flex-center">
                                { productSearch?.recordTotal > basicRows && <div className="">
                                    <Paginator first={productSearch?.first|| 0} rows={basicRows} totalRecords={productSearch?.recordTotal || 0} onPageChange={onPageChange}></Paginator>
                                </div> }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = ({  }: IRootState) => ({

});

const mapDispatchToProps = {
    setLoading
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(QuickSearch);
