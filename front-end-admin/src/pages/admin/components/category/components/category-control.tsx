/** @jsxImportSource @emotion/react */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { connect, Options } from 'react-redux';
import { IControlProps } from 'src/@types/interfaces/control-props';
import { IRootState } from 'src/reducers';
import { CommonUtil } from 'src/utils/common-util';
import BaseDialog from 'src/app/components/BaseDialog';
import { translate } from 'react-jhipster';
import ErrorMessage from 'src/components/error/ErrorMessage';
import CategorySelector from './category-selector';
import CateoryService from 'src/services/category.services';
import { Button } from 'primereact/button';

export type ICategoryControlProps = StateProps & DispatchProps & IControlProps & {
    codeField: string;
    nameField: string;
    selectField: string;
    codeLabel?: string;
    nameLabel?: string;
    placeholder?: string;
}

const CategoryControl = forwardRef((props: ICategoryControlProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const [headerTitle, setHeaderTitle] = useState('');
    const [textValue, setTextValue] = useState('');
    const dialogRef = useRef<any>(null);
    //check control có bị lỗi không?
    const isInvalid = useMemo((): boolean => {
        return CommonUtil.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useEffect(() => {
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, value);
    }, [value]);

    useEffect(() => {
        if (props.initialValue) {
            CateoryService.findById(props.initialValue).then(res => {
                if (res.data) {
                    setTextValue(res.data.data[`${props?.nameField}`]);
                    setValue(res.data.data[`${props?.selectField}`]);
                }
            });
        }
    }, [])

    useEffect(() => {
        if (props.labelKey) {
            setHeaderTitle(`Chọn ${translate(props.labelKey)}`);
        }
    }, [props.labelKey]);

    useImperativeHandle(ref, () => ({
    }));

    const onOpenDialog = () => {
        dialogRef && dialogRef.current.show();
    };

    const onSelected = (selectedData: any) => {
        const valueMap = [];
        if (selectedData && selectedData[`${props?.codeField}`]) {
            valueMap.push(selectedData[`${props?.codeField}`]);
        }
        if (selectedData && selectedData[`${props?.nameField}`]) {
            valueMap.push(selectedData[`${props?.nameField}`]);
        }
        setTextValue(valueMap.join(' - '));
        setValue(selectedData[`${props?.selectField}`]);
        dialogRef && dialogRef.current.hide();
    };

    const onClear = () => {
        setTextValue('');
        setValue(null);
    };

    return (
        <>
            {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{props.labelKey}</label> : ''}
            <div className='form-control-wrap'>
                <div className="p-inputgroup category-selector">
                    <div className={`p-inputtext category-name ${isInvalid ? 'p-invalid' : ''}`}>
                        {textValue}
                    </div>
                    <Button type="button" icon="pi pi-check" className="p-button-danger c-focusable" tooltip="Chọn" onClick={onOpenDialog} />
                    <Button icon="pi pi-times" tooltip="Hủy chọn" onClick={onClear}/>
                </div>
                <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
            </div>
            <BaseDialog
                ref={dialogRef}
                onHide={() => { }}
                header={headerTitle}
            >
                <CategorySelector {...props} onSelected={onSelected}/>
            </BaseDialog>
        </>
    )
});

CategoryControl.displayName = 'CategoryControl';

CategoryControl.defaultProps = {
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
)(CategoryControl);
