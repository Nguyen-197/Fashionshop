import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Button } from 'primereact/button';
type ICategoryActionProps = StateProps & DispatchProps & {
    onAdd: Function,
    onImportExcel: Function,
}

const CategoryAction = (props: ICategoryActionProps) => {
    return (
        <>
            <div className="row action-control">
                <div className="col-sm-12 btn-group">
                    <Button
                        className='p-button-sm'
                        icon="pi pi-plus"
                        label={translate('category.addCategory')}
                        onClick={() => props.onAdd()}
                    />
                    {/* <Button
                        icon="pi pi-download"
                        className="p-button-sm p-button-success"
                        label={translate('category.addCategoryExcel')}
                        onClick={() => props.onImportExcel()}
                    /> */}
                    {/* <Button
                        icon="pi pi-list"
                        className="p-button-sm p-button-warning"
                        label={translate('category.managerProduct')}
                    /> */}
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale }: IRootState) => ({
    currentLocale: locale.currentLocale
});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryAction);
