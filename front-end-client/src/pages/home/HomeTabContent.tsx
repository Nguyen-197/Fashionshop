import {useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Product from 'src/components/product';
import { IRootState } from 'src/reducers';
import { Paginator } from 'primereact/paginator';
import CategoryService from 'src/services/category.services';
import SizeService from 'src/services/size.services';
import ColorService from 'src/services/color.services';
import { Checkbox } from 'primereact/checkbox';
import { log } from 'console';
type HomeTabContent = StateProps & DispatchProps & {
    products: any;
    formSearch?: any;
    height?: number;
    onChangePage?: Function;
}

const HomeTabContent = (props: HomeTabContent) => {
    const products = props.products;
    const [treeDataSize, setTreeDataSize] = useState([]);
    const [treeDataColor, setTreeDataColor] = useState([]);
    const [dataSearch, setDataSearch] = useState({});
    const [loading, setLoading] = useState(false);
    const [basicRows, setBasicRows] = useState(16);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [selectedKeyOrder, setSelectedKeyOrder] = useState([]);
    const [selectedKeySize, setSelectedKeySize] = useState([]);
    const [selectedKeyColor, setSelectedKeyColor] = useState([]);
    const [isToggleFilter, setIsToggleFilter] = useState(false);
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
    const onChangeOrder = (e) => {
        const index = selectedKeyOrder.indexOf(e.value)
        const listOrder = selectedKeyOrder.slice()
        index >= 0 ? listOrder.splice(index, 1) : listOrder.push(e.value)
        setSelectedKeyOrder(listOrder);
    }
    const onChangeSize= (e) => {
        const index = selectedKeySize.indexOf(e.value)
        const listSize = selectedKeySize.slice()
        index >= 0 ? listSize.splice(index, 1) : listSize.push(e.value)
        setSelectedKeySize(listSize);
    }
    const onChangeColor = (e) => {
        console.log(e);
        
        const index = selectedKeyColor.indexOf(e.value)
        const listColor = selectedKeyColor.slice()
        index >= 0 ? listColor.splice(index, 1) : listColor.push(e.value)
        setSelectedKeyColor(listColor);
    }
    const hanlderFilter = () => {
        const form = {
            listProductColor: selectedKeyColor.slice(),
            listProductSize: selectedKeySize.slice()
        }
        console.log("form", form);
        
        const formFilter = Object.assign({} , dataSearch, form)
        setDataSearch(formFilter)
    }
    useEffect(() => {
        props.formSearch(dataSearch)
    }, [dataSearch] )
    useEffect(() => {
        const loadDatasource = async () => {
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
            <div className="container" style={{ marginBottom: '50px' }}>
                <div>
                    <div className='d-flex justify-content-end relative px-5'style={{ zIndex: '10' }}>
                        <div className='relative select-filter' onClick={() =>setIsToggleFilter(!isToggleFilter)}>
                            <span className='relative'>Bộ lọc <i style={{ top: '6px' }} className="ic-up ic-chevron"></i></span>
                        </div>
                            { isToggleFilter &&
                                <div className='popup-filter'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <div className='popup-filter--name'>Kích cỡ</div>
                                            <ul className='popup-filter--list'>
                                                {treeDataSize?.map((item, index) => {
                                                    return (
                                                        <li key={index} className="field-checkbox popup-filter--item">
                                                            <Checkbox inputId={`ck_size_` + index} name="size" value={item.code} onChange={onChangeSize} checked={selectedKeySize.indexOf(item.code) !== -1} />
                                                            <label htmlFor={`ck_size_` + index}>{item.name}</label>
                                                        </li>
                                                    )
                                                } )}
                                            </ul>
                                        </div>
                                        <div>
                                            <div className='popup-filter--name'>Màu sắc</div>
                                            <ul className='popup-filter--list'>
                                                {treeDataColor?.map((item, index) => {
                                                    return (
                                                        <li key={index} className="field-checkbox popup-filter--item">
                                                            <Checkbox inputId={`ck_color_` + index} name="color" value={item.code} onChange={onChangeColor} checked={selectedKeyColor.indexOf(item.code) !== -1} />
                                                            <label htmlFor={`ck_color_` + index}>{item.name}</label>
                                                        </li>
                                                    )
                                                } )}
                                            </ul>
                                        </div>
                                        <div>
                                            <div className='popup-filter--name'>Sắp xếp</div>
                                            <ul className='popup-filter--list'>
                                                <li className="field-checkbox popup-filter--item">
                                                    <Checkbox inputId='ck-order-1' name="order" value='name_asc' onChange={onChangeOrder} checked={selectedKeyOrder.indexOf('name_asc') !== -1} />
                                                    <label htmlFor='ck-order-1'>Tên (A-Z)</label>
                                                </li>
                                                <li className="field-checkbox popup-filter--item">
                                                    <Checkbox inputId='ck-order-2' name="order" value='name_desc' onChange={onChangeOrder} checked={selectedKeyOrder.indexOf('name_desc') !== -1} />
                                                    <label htmlFor='ck-order-2'>Tên (Z-A)</label>
                                                </li>
                                                <li className="field-checkbox popup-filter--item">
                                                    <Checkbox inputId='ck-order-3' name="order" value='cost_asc' onChange={onChangeOrder} checked={selectedKeyOrder.indexOf('cost_asc') !== -1} />
                                                    <label htmlFor='ck-order-3'>Giá tăng dần</label>
                                                </li>
                                                <li className="field-checkbox popup-filter--item">
                                                    <Checkbox inputId='ck-order-4' name="order" value='cost_desc' onChange={onChangeOrder} checked={selectedKeyOrder.indexOf('cost_desc') !== -1} />
                                                    <label htmlFor='ck-order-4'>Giá giảm dần</label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-end'>
                                        <div className="btn-cancer flex-center btn" onClick={() =>setIsToggleFilter(false)}>
                                            <p>Hủy</p>
                                        </div>
                                        <div className="btn-filter flex-center btn" onClick={hanlderFilter}>
                                            <p>Tìm kiếm</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        <div></div>

                    </div>
                    <div className="row">
                        { products?.data?.map((item, index) => {
                            return (
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" key={item.id}>
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
                                Chưa có gì
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