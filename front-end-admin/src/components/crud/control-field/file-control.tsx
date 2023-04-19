
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { IFieldProps } from '../interface/field-prop';
import _ from 'lodash';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { CommonUtil } from '../../../utils/common-util';
import { classNames } from 'primereact/utils';
import { DataScroller } from 'primereact/datascroller';
import saveAs from 'save-as';
import FileStorageService from '../../../services/file-storage.services';
import { RESPONSE_TYPE } from '../../../constants/constants';

type IFileControlProps = IFieldProps & {
}
// https://formik.org/docs/examples/dependent-fields
const FileControl = forwardRef((props: IFileControlProps, ref) => {
    const [value, setValue] = useState(props.defaultValue || {});
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
                const preUploadFiles = uploadedFiles;
                const listPromise = [];
                const listFile = Object.values(evt.path[0].files);
                for (let index = 0; index < listFile.length; index++) {
                    const item = listFile[index];
                    const formData = new FormData();
                    formData['file'] = item;
                    listPromise.push(FileStorageService.uploadFile(formData));
                }
                await Promise.all(listPromise).then(resp => {
                    resp?.forEach(item => {
                        const result = item?.data;
                        if (result?.type == RESPONSE_TYPE.SUCCESS) {
                            // value.push(result.data.url);
                            preUploadFiles.push(result.data);
                        }
                    })
                    setUploadedFiles(_.cloneDeep(preUploadFiles));
                    setValue(_.cloneDeep({
                        ...value,
                        upstreamFile: uploadedFiles
                    }));
                });
            }
        };
        input.click();
    }

    const removeFile = async (file) => {
        const idx = uploadedFiles.findIndex(e => e.uuid == file.uuid);
        if (idx > -1) {
            await FileStorageService.removeFileByUUID(uploadedFiles[idx]?.uuid).then(resp => {
                if (resp.data.type == RESPONSE_TYPE.SUCCESS) {
                    // value.splice(idx, 1);
                    uploadedFiles.splice(idx, 1);
                    setUploadedFiles(_.cloneDeep(uploadedFiles));
                    setValue(_.cloneDeep({
                        ...value,
                        upstreamFile: uploadedFiles
                    }));
                }
            })
        }
    }

    const downloadFile = async (file) => {
        await FileStorageService.download(file.uuid).then(res => {
            saveAs(res.data, file.name);
        });
    }

    const templateHeader = (options) => {
        const className = `${options.className} `;
        const titleClassName = `${options.titleClassName} pl-1`;

        return (
            <div className={className}>
                <span className={titleClassName}>
                    Hình ảnh
                </span>
                <Button type="button" disabled={disableUpdate} icon="pi pi-upload" className="p-button-sm"
                    tooltip="Chọn file" tooltipOptions={{ position: 'bottom' }}
                    onClick={openDialogSelectFile} />
            </div>
        )
    }

    const disableUpdate = useMemo(() => {
        return props.disabled || (props.multiple ? false : uploadedFiles.length == 1);
    }, [props.multiple, uploadedFiles]);

    const itemTemplate = (file) => {
        return (<div className={classNames({'item-attach d-flex': true})}>
                 <div className="file-info flex-fill">
                     <span className="file-name">{file.name}</span>
                     <span className="file-size">{CommonUtil.viewFileSize(file.size)}</span>
                 </div>
                 <div className="file-action">
                     { file.type == 'stored_file' && <Button type="button" icon="pi pi-download" className="p-button-rounded p-button-danger p-button-text" tooltip={`Tải xuống ${file.name}`}
                         tooltipOptions={{ position: 'bottom' }} onClick={() => downloadFile(file)}/> }
                     <Button type="button" icon="pi pi-times-circle" className="p-button-rounded p-button-danger p-button-text" tooltip={`Xóa ${file.name}`}
                         tooltipOptions={{ position: 'bottom' }} onClick={() => removeFile(file)}/>
                 </div>
         </div>)
    }
    return (
        <>
            <div className={`file-wrap ${uploadedFiles.length ? 'justify-content-start' : ''}`}>
                { uploadedFiles.length > 0 &&
                    <div className="item" style={{ boxShadow: 'unset', border: '1px dashed #D3D5D7'}} onClick={openDialogSelectFile}>
                        <i className="pi pi-plus"></i>
                    </div>
                }
                {
                    uploadedFiles.length ? uploadedFiles.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <div className="item">
                                    <div style={{ backgroundImage: `url(${item.url})` }}>
                                    </div>
                                        <span className="close" onClick={() => removeFile(item)}>
                                            <i className="pi pi-times"></i>
                                        </span>
                                </div>
                            </React.Fragment>
                        )
                    }) :
                    <React.Fragment>
                        <div className="d-flex justify-content-center align-items-center">
                            <i className="pi pi-plus"></i>
                            <p className="d-flex justify-content-center align-items-center" style={{ marginLeft: '12px' }}>Kéo thả hoặc <a href="#javascript" onClick={openDialogSelectFile}>&ensp;tải ảnh lên từ thiết bị</a></p>
                        </div>
                    </React.Fragment>
                }
                {/* <Panel headerTemplate={templateHeader} toggleable
                    collapsed={panelCollapsed} onToggle={(e) => setPanelCollapsed(e.value)}
                    className="file-control"
                >
                    { value?.length > 0 ? value.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <img src={item} alt={`image-${index}`} />
                            </React.Fragment>
                        )
                    }) : <>
                            <span className="file-control-nodata">Không có dữ liệu</span>
                         </>
                    }
                </Panel> */}
                {getFormErrorMessage(props.fieldPath)}
            </div>
        </>
    )
});


export default FileControl;
