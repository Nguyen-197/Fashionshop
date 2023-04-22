import classNames from 'classnames';
import { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { IRootState } from 'src/reducers';
import { useHistory } from 'react-router-dom';
import { getUserInfo } from 'src/reducers/authentication';
import MenuItemDropdown from "./MenuItemDropdown";
import { Link } from "react-router-dom";
import YunoLogo from 'src/assets/images/new-folder-image/logo/logo.png'
import * as IoIcon from "react-icons/io5";
import * as AiIcon from "react-icons/ai";
import { Storage } from 'react-jhipster';
import { CartContext } from 'src/context/cart';
import QuickCart from 'src/pages/cart/QuickCart';
import accountServices from 'src/services/account.services';
import { UserContext } from 'src/context/user';
import { RESPONSE_TYPE } from 'src/@types/enums';
import QuickSearch from 'src/pages/search/QuickSearch';
import LocalStorage from 'src/utils/LocalStorage';
import categoryServices from 'src/services/category.services';
import { log } from 'console';
type IHeaderProps = StateProps & DispatchProps & {
    mode?: boolean;
}
const Header = (props: IHeaderProps) => {
    let prev = 0;
    const { userInfo, setUserInfoFunc } = useContext(UserContext);
    const history = useHistory();
    const location = history.location.pathname;
    const [treeDataCategory, setTreeDataCategory] = useState([]);
    const [scrolled, setScrolled] = useState(false);
    const [whiteBox, setWhiteBox] = useState(false);
    const [disableBox, setDisableBox] = useState(false);
    const [dropdownHover, setDropdownHover] = useState(false);
    const [headerMenu, setHeaderMenu] = useState([]);
    const [totalCart, setTotalCart] = useState(0);
    const { cartItems, opendCart, setOpendCart } = useContext(CartContext);
    const [cartOpen, setCartOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    if(opendCart || searchOpen) {
        document.body.style.overflow = 'hidden';
    }
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
    useEffect(() => {
        const _headerMenu = [
            {
                id: 1,
                label: "Home",
                url: "/home",
                dropdownContent: []
            },
            {
                id: 2,
                label: "Product",
                classNames: "drop-item"
            },
            {
                id: 3,
                label: "News",
                url: "/news",
                dropdownContent: []
            },
            {
                id: 4,
                label: "Contact",
                url: "/contact",
                dropdownContent: []
            },
        ];
        setHeaderMenu(_headerMenu)
        const loadDatasource = async () => {
            await categoryServices.initTreeOrg().then((res: any) => {
                setTreeDataCategory(convertTreeNode(res?.data?.data));
                console.log("treeDataCategory", convertTreeNode(res?.data?.data));
            });
        }
        loadDatasource();
        
    }, []);

    useEffect(() => {
        let virtualCartCount = 0;
        for (let i = 0; i < cartItems.length; i++) {
            virtualCartCount += cartItems[i].quantity;
        }
        setTotalCart(virtualCartCount);
    }, [cartItems])

    useEffect(() => {
        const token = Storage.local.get('token');
        if (token) {
            const fetchData = async () => {
                try {
                    const userInfo = await accountServices.getUserInfo();
                    if (userInfo.data.type == RESPONSE_TYPE.SUCCESS) {
                        setUserInfoFunc(userInfo.data.data);
                    }
                } catch (error) {
                    LocalStorage.clear();
                    Storage.local.remove('token');
                    Storage.local.remove('cart-items');
                    Storage.local.remove('wish-list');
                    return;
                }
            };
            fetchData();
        } else {
            Storage.local.remove('token');
            Storage.local.remove('userInfo');
        }
    }, [Storage.local.get('token')]);
   
    const handleClick = () => {
        window.scrollTo(0,0)
    }

    useEffect(() => {
        if (!opendCart || !searchOpen) {
            document.body.style.overflow = "hidden auto";
        }
    }, [opendCart, searchOpen]);

    const clickToClose = () => {
        document.body.style.overflow = "hidden auto";
        setOpendCart(false);
        setSearchOpen(false);
    };

    return (
        <>
            <div className={classNames('header_wrap', {
                scrolled: scrolled === true,
                white: whiteBox === true || !props.mode,
                white_disable: disableBox === true && props.mode,
            })} >
                <div className="header-logo flex-center">
                    <Link to="/home">
                        <img src={YunoLogo} alt="logo"></img>
                    </Link>
                </div>
                <ul className="menu flex-between p-0">
                    {
                        headerMenu.map((item, index)=> {
                            return (
                                <MenuItemDropdown
                                    handleClick={handleClick}
                                    dropdownHover={dropdownHover}
                                    scrolled={scrolled}
                                    location={location}
                                    key={index}
                                    whiteText={false}
                                    label={item.label}
                                    url={item.url}
                                    dropdownContent={item.dropdownContent}
                                    className={`menu-item ${item.classNames ? item.classNames : ''}`}
                                />
                            )
                        })
                    }
                </ul>
                <div className="header-right flex-center">
                    <div className="search_block" onClick={() => { setSearchOpen(true) }}>
                        <IoIcon.IoSearchOutline className="icons" />
                    </div>
                    <div className="heart_block">
                        <Link to="/favorites">
                            <IoIcon.IoHeartOutline className="icons" />
                        </Link>
                    </div>
                    <div className="cart_block" onClick={() => { setOpendCart(true) }}>
                        <IoIcon.IoCartOutline className="icons" />
                        <span id="cart_count">{ totalCart }</span>
                    </div>
                    <div className="user_block">
                        <Link to={`${userInfo ? '/purchase?state=0' : '/login'}`}>
                            <AiIcon.AiOutlineUser className="icons" />
                        </Link>
                    </div>
                </div>
                { opendCart && <QuickCart
                    clickToClose={clickToClose}
                /> }
                { searchOpen && <QuickSearch
                    searchOpen={searchOpen}
                    clickToClose={clickToClose}
                /> }
                <div className='container-drop'>
                    <div className="container d-flex">
                        { treeDataCategory.map((item, index) => {
                            return (
                                <div className="col-md-2 col-sm-2" key={index}>
                                    {!item.parentId && <a href='#' className='parent-label'>{item.name}</a> }
                                    { item.listCategoryChild.length > 0 &&
                                     <ul>
                                        {item.listCategoryChild.map((itemChild , indexChild) => {
                                            return (
                                                <li key={indexChild}><a href='#'>{itemChild.name}</a></li>
                                            )
                                        })}
                                     </ul> 
                                     }
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div> 
        </>
    )
}

Header.defaultProps = {
    mode: true
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    accountInfo: authentication.accountInfo,
});

const mapDispatchToProps = {
    getUserInfo
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(Header);