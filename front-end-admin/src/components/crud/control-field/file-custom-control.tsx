
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { CommonUtil } from '../../../utils/common-util';
import { classNames } from 'primereact/utils';
import { DataScroller } from 'primereact/datascroller';
import saveAs from 'save-as';
import FileStorageService from '../.././../services/file-storage.services';
import { RESPONSE_TYPE } from '../../../constants/constants';

type IFileCustomControlProps = IFieldProps & {
}
// https://formik.org/docs/examples/dependent-fields
const FileCustomControl = forwardRef((props: IFileCustomControlProps, ref) => {
    const [value, setValue] = useState(props.defaultValue || null);
    const [panelCollapsed, setPanelCollapsed] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        if (!props.updateStateElement || props.disabled) {
            return;
        }
        props.updateStateElement(props.fieldName, value);
        setUploadedFiles(value?.upstreamFile || []);
    }, [value]);

    const isFormFieldValid = (name) => {
        const _touched = _.get(props?.formik?.touched, name);
        return !!(_touched && props?.formik?.errors[name])
    };
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{props?.formik?.errors[name]}</small>;
    };

    const openDialogSelectFile = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        if (props.acceptType) {
            input.setAttribute('accept', props.acceptType);
        }
        if (props.multiple) {
            input.setAttribute('multiple', 'multiple');
        }
        input.onchange = async (evt: any) => {
            if (evt.path?.length > 0) {
                const uploadFiles = [];
                const listPromise = [];
                const listFile = Object.values(evt.path[0].files);
                for (let index = 0; index < listFile.length; index++) {
                    const item = listFile[index];
                    const formData = new FormData();
                    formData['file'] = item;
                    listPromise.push(FileStorageService.uploadFile(formData));
                }
                let preValue = _.cloneDeep(value);
                await Promise.all(listPromise).then(resp => {
                    resp?.forEach(item => {
                        const result = item?.data;
                        if (result?.type == RESPONSE_TYPE.SUCCESS) {
                            if (props.multiple) {
                                preValue.push(result.data.url);
                                uploadedFiles.push(result.data);
                            } else {
                                preValue = result.data.url;
                                uploadedFiles.push(result.data);
                            }
                        }
                    })
                    setValue(_.cloneDeep(preValue));
                    setUploadedFiles(_.cloneDeep(uploadedFiles));
                });
            }
        };
        input.click();
    }

    const disableUpdate = useMemo(() => {
        return props.disabled || (props.multiple ? false : uploadedFiles.length == 1);
    }, [props.multiple, uploadedFiles]);

    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center">
                {
                    value ?
                    <React.Fragment>
                        <img onClick={openDialogSelectFile} width={80} height={80} src={value} />
                    </React.Fragment> :
                    <div onClick={openDialogSelectFile} style={{ width: '80px', height: '80px', border: '1px dashed #D3D5D7' }} className="flex align-items-center justify-content-center flex-column">
                        <i className="pi pi-image" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                    </div>
                }
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
    )
});


export default FileCustomControl;
