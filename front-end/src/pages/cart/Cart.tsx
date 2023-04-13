import { useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { useHistory } from 'react-router-dom';
import BaseLayout from 'src/components/layouts/BaseLayout';
import { setLoading } from 'src/reducers/authentication';
import Navigation from 'src/components/layouts/Navigation';
type ICartIndexProps = StateProps & DispatchProps & {
}

const CartIndex = (props: ICartIndexProps) => {
    const history = useHistory();
    useEffect(() => {
        props.setLoading(true);
        const timer = setTimeout(() => {
            props.setLoading(false)
        }, 1500);
        return () => {
            clearTimeout(timer);
        }
    }, []);
    return (
        <>
            <div style={{ paddingTop: 100 }}>
                <BaseLayout>
                    <div>
                        <Navigation />
                        <div className="site-content">

                        </div>
                    </div>
                </BaseLayout>
            </div>
        </>
    )
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
)(CartIndex);
