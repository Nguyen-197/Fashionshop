

import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';

type IColorActionProps = StateProps & DispatchProps & {
    onAdd?: Function,
    onImportExcel?: Function
}

const ColorAction = (props: IColorActionProps) => {
    return (
        <>
            <div className="row action-control">
                <div className="col-sm-12 btn-group">
                    <Button
                        className='p-button-sm'
                        icon="pi pi-plus"
                        label={translate('color.addColor')}
                        onClick={() => props.onAdd()}
                    />
                    {/* <Button
                        icon="pi pi-download"
                        className="p-button-sm p-button-success"
                        label={translate('color.addColorExcel')}
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
)(ColorAction);
