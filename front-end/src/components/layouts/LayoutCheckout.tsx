import Header from './Header';
import Footer from './Footer';
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
type ILayoutCheckoutProps = StateProps & DispatchProps & {
    title?: string;
    children: JSX.Element;
}
const LayoutCheckout: React.FC<ILayoutCheckoutProps> = (props: ILayoutCheckoutProps) => {
    return (
        <>
            <Header mode={false} />
                { props.children }
            <Footer />
        </>
    );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
    accountInfo: authentication.accountInfo,
});

const mapDispatchToProps = {

};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(LayoutCheckout);
