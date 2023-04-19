import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';

type IProductNotExitsProps = StateProps & DispatchProps & {
}

const ProductNotExits = (props: IProductNotExitsProps) => {
    return (
        <>
            <div className="product-not-exist">
                <div className="product-not-exist__content">
                    <img src={require('../../assets/images/product_not_exit.png')} alt="Sản phẩm này không tồn tại" />
                    <p className="product-not-exist__text">Sản phẩm này không tồn tại</p>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
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
)(ProductNotExits);
