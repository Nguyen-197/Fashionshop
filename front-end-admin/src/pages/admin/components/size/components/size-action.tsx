

import { Button } from 'primereact/button';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from '../../../../../reducers';
import { CommonUtil } from '../../../../../utils/common-util';
import SizeService from '../../../../../services/size.services';

type ISizeActionProps = StateProps & DispatchProps & {
    onAdd?: Function,
    onImportExcel?: Function
}

const SizeAction = (props: ISizeActionProps) => {
    return (
        <>
            <div className="row action-control">
                <div className="col-sm-12 btn-group">
                    <Button
                        className='p-button-sm'
                        icon="pi pi-plus"
                        label={translate('size.addSize')}
                        onClick={() => props.onAdd()}
                    />
                    {/* <Button
                        icon="pi pi-download"
                        className="p-button-sm p-button-success"
                        label={translate('size.addSizeExcel')}
                        onClick={() => props.onImportExcel()}
                    /> */}
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SizeAction);
