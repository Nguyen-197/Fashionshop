import Header from './Header';
import Footer from './Footer';
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
type ILayoutProps = StateProps & DispatchProps & {
    title?: string;
    children: JSX.Element;
}
const BaseLayout: React.FC<ILayoutProps> = (props: ILayoutProps) => {
    return (
        <>
            <Header />
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
)(BaseLayout);
