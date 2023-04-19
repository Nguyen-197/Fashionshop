import { Button } from "primereact/button";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import BaseDialog from "src/app/components/BaseDialog";
import { IRootState } from "src/reducers";
import productServices from "src/services/product.services";
import { saveAs } from 'file-saver';
type IProductFormExportProps = StateProps & DispatchProps & {
    onHideFormExport?: () => void,
}
const ProductFormExport = (props: IProductFormExportProps) => {

    const productExportRef = useRef<any>(null);
    const [title, setTitle] = useState(null);
    useEffect(() => {
        setTitle("Nhập danh sách sản phẩm");
        productExportRef.current && productExportRef.current.show()
    }, [])
    
    const footer = () => (
        <>
            <div className='text-center'>
                <Button
                    label={"Import"}
                    icon="pi pi-check"
                />
            <Button type="button" label={"Đóng"} icon="pi pi-times" className="p-button-danger" onClick={() => {props.onHideFormExport && props.onHideFormExport()}} />
        </div>
        </>
    )
    const onDowloadTemplate = async () => {
        await productServices.dowloadTemplate().then(resp => {
            if (resp.status == 200) {
                saveAs(resp.data, 'import_product_template.xls');
            }
        }).catch((e)=>{console.log(e);
        })
    }

    return (
        <>
            <BaseDialog
                ref={productExportRef}
                onHide={() =>{props.onHideFormExport && props.onHideFormExport()}}
                header={title}
                footer={footer}
                style={{ width: '60vw' }}
            >
                {/* <div>
                    <React.Fragment>
                        <div className="d-flex justify-content-center align-items-center">
                            <i className="pi pi-plus"></i>
                            <p className="d-flex justify-content-center align-items-center" style={{ marginLeft: '12px' }}>Kéo thả hoặc <a href="#javascript" >Chọn tệp tin</a></p>
                        </div>
                    </React.Fragment>
                </div> */}
                <div className="text-center m-2">
                    <Button className="p-button-text" icon="pi pi-arrow-down" label="Tải về file biểu mẫu" onClick={() => onDowloadTemplate()}/>
                </div>
            </BaseDialog>
        </>
    )
    
}
const mapStateToProps = ({}: IRootState) => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductFormExport);