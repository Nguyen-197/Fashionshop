import React, { useContext, useEffect, useState } from 'react'
import { CommonUtil } from 'src/utils/common-util';
import { UserContext } from "./user";
import cartService from 'src/services/cart.services';
import { RESPONSE_TYPE } from 'src/@types/enums';
import { ProductDetailModel } from 'src/models/ProductDetailModel';
import favoriesServices from 'src/services/favories.services';
import { CartItemModel } from 'src/models/CartModel';
import { ProductItem } from 'src/models/Product';
import _ from 'lodash';
import { Toast } from 'src/components/toast/toast.utils';

type ICartProps = {
    children: JSX.Element;
}
interface CartContextInterface {
}

export const CartContext = React.createContext<CartContextInterface | any>(null);

export function CartProvider(props: ICartProps) {
    const { userInfo } = useContext(UserContext);
    const [opendCart, setOpendCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [wishListItems, setWishListItems] = useState([]);
    const [clickedCart, setClickedCart] = useState(0);
    const [total, setTotal] = useState(0);
    const [listSelected, setListSelected] = useState([]);

    const fetchDataCart = async () => {
        await cartService.getUserCarts().then(resp => {
            const rest = resp.data;
            if (rest.type == RESPONSE_TYPE.SUCCESS) {
                getTotal(rest.data);
                setCartItems(_.cloneDeep(rest.data));
                CommonUtil.setLocalStorage("cart-items", JSON.stringify(rest.data));
            }
        });
    }

    const fetchDataWishList = async () => {
        await favoriesServices.getUserFavorites().then(resp => {
            const rest = resp.data;
            if (rest.type == RESPONSE_TYPE.SUCCESS) {
                setWishListItems(rest.data.data);
                CommonUtil.setLocalStorage("wish-list", JSON.stringify(rest.data));
            }
        });
    }

    useEffect(()=>{
        const fetchData = async () => {
            if (userInfo) {
                await fetchDataCart();
                await fetchDataWishList();
            } else {
                if (CommonUtil.getLocalStorage('cart-items')) {
                    setCartItems(JSON.parse(CommonUtil.getLocalStorage('cart-items')));
                }
                if (CommonUtil.getLocalStorage('wish-list')) {
                    setWishListItems(JSON.parse(CommonUtil.getLocalStorage('wish-list')));
                }
                if (CommonUtil.getLocalStorage('total')) {
                    setTotal(JSON.parse(CommonUtil.getLocalStorage('total')));
                }
            }
        }
        fetchData();
    }, [userInfo]);
    /**
     * isExists
     * @param cartItems
     * @param item
     * @returns
     */
    const isExists = (cartItems = [], item: ProductDetailModel) => {
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].id === item.id) {
                return cartItems[i];
            }
        }
        return false;
    };
    /**
     * getTotal
     * @param arr
     */
    const getTotal = (arr) => {
        let virtualTotal = 0;
        for (let i in arr) {
            if (arr[i].salePrice > 0) {
                virtualTotal += arr[i].quantity * arr[i].salePrice;
            } else {
                virtualTotal += arr[i].quantity * arr[i].finalPrice;
            }
        }
        setTotal(virtualTotal);
        CommonUtil.setLocalStorage("total", JSON.stringify(virtualTotal));
    };

    const addToCart = async (productDetail: ProductDetailModel, quantity: number) => {
        if (quantity) {
            if (userInfo) {
                const formData = { idProductDetails: productDetail.id, quantity: quantity };
                const rest = await cartService.addCartItem(formData);
                if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                    console.log(">>>> add-to-cart: ", JSON.stringify(productDetail));
                    await fetchDataCart();
                }
            } else {
                const virtualCart = [...cartItems];
                if (cartItems.length === 0) {
                    virtualCart.push({ ...productDetail, quantity: quantity, productName: productDetail.productName, colorName: productDetail.colorName, sizeName: productDetail.sizeName });
                } else {
                    if (!isExists(cartItems, productDetail)) {
                        virtualCart.push({ ...productDetail, quantity: quantity, productName: productDetail.productName, colorName: productDetail.colorName, sizeName: productDetail.sizeName });
                    } else {
                        for (let i = 0; i < virtualCart.length; i++) {
                            if (virtualCart[i].id === productDetail.id) {
                                virtualCart[i].quantity += quantity;
                                break;
                            }
                        }
                    }
                }
                CommonUtil.setLocalStorage("cart-items", JSON.stringify(virtualCart));
                setCartItems(virtualCart);
                getTotal(virtualCart);
                Toast.show(RESPONSE_TYPE.SUCCESS, null, "Đã thêm sản phẩm vào giỏ hàng");
            }
        } else {
            if (userInfo) {
                const formData = { idProductDetails: productDetail.id, quantity: 1 };
                const rest = await cartService.addCartItem(formData);
                if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                    console.log(">>>> add-to-cart: ", JSON.stringify(productDetail));
                    await fetchDataCart();
                }
            } else {
                const virtualCart = [...cartItems];
                if (cartItems.length === 0) {
                    virtualCart.push({ ...productDetail, quantity: 1, productName: productDetail.productName, colorName: productDetail.colorName, sizeName: productDetail.colorName });
                } else {
                    if (!isExists(cartItems, productDetail)) {
                        virtualCart.push({ ...productDetail, quantity: 1, productName: productDetail.productName, colorName: productDetail.colorName, sizeName: productDetail.colorName });
                    } else {
                        for (let i = 0; i < virtualCart.length; i++) {
                            if (virtualCart[i].id == productDetail.id) {
                                virtualCart[i].quantity += 1;
                                break;
                            }
                        }
                    }
                }

                CommonUtil.setLocalStorage("cart-items", JSON.stringify(virtualCart));
                setCartItems(virtualCart);
                getTotal(virtualCart);
            }
        }
    };

    /**
     * removeCart
     * @param id
     */
    const removeCart = async (id: any) => {
        const virtualCart = [...cartItems];
        for (let i = 0; i < virtualCart.length; i++) {
            if (virtualCart[i].id === Number(id)) {
                if (userInfo) {
                    // xử lí call apt remove cart
                    const rest = await cartService.delete(Number(id));
                    if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                        console.log(">>>> delete cart item: ", virtualCart[i]);
                    }
                }
                virtualCart.splice(i, 1);
                break;
            }
        }
        CommonUtil.setLocalStorage("cart-items", JSON.stringify(virtualCart));
        setCartItems(virtualCart);
        getTotal(virtualCart);
    };

    /**
     * reductAmount
     * @param e
     * @param item
     */
    const reductAmount = async (e, item: CartItemModel) => {
        console.log(">>>> item: ", item);
        const quantity = item.quantity;
        const cartId = e.target.id;
        const virtualCart = [...cartItems];
        for (let i = 0; i < virtualCart.length; i++) {
            if (virtualCart[i].id === Number(cartId)) {
                if (virtualCart[i].quantity > 1) {
                    virtualCart[i].quantity = virtualCart[i].quantity - 1;
                    const formData = { id: cartId, idProductDetails: item.idProductDetail, quantity: virtualCart[i].quantity };
                    const rest = await cartService.addCartItem(formData);
                    if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                        console.log(">>>> reductAmount: ", item);
                    }
                } else {
                    CommonUtil.confirmDeleteCartItem(async () => {
                        try {
                            await removeCart(item.id);
                        } catch (error) {
                            console.log(">>>> delete cart item error: ", error);
                        }
                    }, () => {
                        const element = document.querySelector(`input[id='${item.id}']`) as HTMLInputElement;
                        if (element) element.value = `${item.quantity}`;
                     }, `${item.productName}`);
                }
                break;
            }
        }
        if (userInfo) {
            if (quantity > 0) {
                // update quantity cart item
            }
        }
        CommonUtil.setLocalStorage("cart-items", JSON.stringify(virtualCart));
        setCartItems(virtualCart);
        getTotal(virtualCart);
    };
    /**
     * increaseAmount
     * @param e
     * @param item
     */
    const increaseAmount = async (e, item: CartItemModel) => {
        console.log(">>>> item: ", item);
        const cartId = e.target.id;
        const virtualCart = [...cartItems];

        for (let i = 0; i < virtualCart.length; i++) {
            if (virtualCart[i].id === Number(cartId)) {
                virtualCart[i].quantity = virtualCart[i].quantity + 1;
                if (userInfo) {
                    // xu li call API update quantity cart item
                    const formData = { id: cartId, idProductDetails: item.idProductDetail, quantity: virtualCart[i].quantity };
                    const rest = await cartService.addCartItem(formData);
                    if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                        console.log(">>>> increaseAmount: ", item);
                    }
                }
                break;
            }
        }
        CommonUtil.setLocalStorage("cart-items", JSON.stringify(virtualCart));
        setCartItems(virtualCart);
        getTotal(virtualCart);
    };
    /**
     * updateQuantity
     * @param e
     * @param item
     */
    const updateQuantity = async (e, item: CartItemModel) => {
        const id = e.target.id;
        const value = e.value;
        const virtualCart = [...cartItems];
        for (let i = 0; i < virtualCart.length; i++) {
            if (virtualCart[i].id === Number(id)) {
                virtualCart[i].quantity = Number(value);
            }
        }

        if (userInfo) {
            if (value > 0) {
                // xu li call API update quantity cart item
                const formData = { id: id, idProductDetails: item.idProductDetail, quantity: Number(value) };
                const rest = await cartService.addCartItem(formData);
                if (rest.data.type === RESPONSE_TYPE.SUCCESS) {
                    console.log(">>>> update quantity cart item: ", item);
                }
            }
        }

        CommonUtil.setLocalStorage("cart-items", JSON.stringify(virtualCart));
        setCartItems(virtualCart);
        getTotal(virtualCart);
    };
    /**
     * addToWishList
     * @param product
     */
    const addToWishList = async (product: ProductItem) => {
        const virtualWish = [...wishListItems]
        if (wishListItems.length === 0) {
            if (userInfo) {
                const formData = { idProduct: product.id };
                const rest = await favoriesServices.addFavoriesItem(formData);
                if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                    console.log(">>>> add to wish list: ", product);
                }
            }
            virtualWish.push({...product, productName: product.name});
        } else {
            if (!isExists(wishListItems, product)) {
                if (userInfo) {
                    const formData = { idProduct: product.id };
                    const rest = await favoriesServices.addFavoriesItem(formData);
                    if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                        console.log(">>>> add to wish list: ", product);
                    }
                }
                virtualWish.push({...product, productName: product.name});
            }
        }
        CommonUtil.setLocalStorage("wish-list", JSON.stringify(virtualWish));
        setWishListItems(virtualWish);
    }

    const removeFromWishList = async (product: ProductItem) => {
        const id = product.id
        const virtualWish = [...wishListItems]
        for (let i = 0; i < virtualWish.length; i++) {
            if (virtualWish[i].id == id) {
                if (userInfo) {
                    const rest = await favoriesServices.delete(id);
                    if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                        console.log(">>>> delete cart item: ", virtualWish[i]);
                    }
                }
                virtualWish.splice(i, 1)
            }
        }
        CommonUtil.setLocalStorage("wish-list", JSON.stringify(virtualWish));
        setWishListItems(virtualWish)
    }

    useEffect(() => {
        if (!opendCart) {
            setListSelected([]);
        }
    }, [opendCart]);
    return (
        <CartContext.Provider
            value={{
                cartItems: cartItems,
                wishListItems: wishListItems,
                setCartItems: setCartItems,
                addToCart: addToCart,
                addToWishList: addToWishList,
                updateQuantity: updateQuantity,
                removeCart: removeCart,
                removeFromWishList: removeFromWishList,
                reductAmount: reductAmount,
                increaseAmount: increaseAmount,
                total: total,
                opendCart: opendCart,
                setOpendCart: setOpendCart,
                fetchDataCart: fetchDataCart,
                fetchDataWishList: fetchDataWishList,
                listSelected: listSelected,
                setListSelected: setListSelected
            }}
        >
            { props.children }
        </CartContext.Provider>
    )
}