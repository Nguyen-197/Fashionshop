import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { connect, Options } from 'react-redux';
import { Dialog, DialogProps } from 'primereact/dialog';
import { IRootState } from 'src/reducers';

type IBaseDialogProps = StateProps & DispatchProps & DialogProps & {
    onHide?: Function;
}

const BaseDialog = forwardRef((props: IBaseDialogProps, ref: any) => {
    const [displayModal, setDisplayModal] = useState(false);

    const onHide = () => {
        setDisplayModal(false);
        props.onHide && props.onHide(); 
    };

    useImperativeHandle(ref, () => ({
        show() {
            setDisplayModal(true);
        },
        hide() {
            onHide();
        }
    }));

    return (
        <>
            <Dialog {...props} visible={displayModal} onHide={onHide}>
                {props.children}
            </Dialog>
        </>
    );
});

BaseDialog.displayName = 'BaseDialog';

BaseDialog.defaultProps = {
    style: { width: '50vw' },
    closeOnEscape: false
};

const mapStateToProps = ({ }: IRootState) => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;
const options = { forwardRef: true };
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
)(BaseDialog);

