
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { IControlProps } from 'src/@types/interfaces/control-props';
import { FileControlProps } from 'src/@types/interfaces/file-control-props';
import FileStorageService from 'src/services/file-storage.services';
import { RESPONSE_TYPE } from 'src/enum';
import _ from 'lodash';
import ErrorMessage from 'src/components/error/ErrorMessage';
import BaseDialog from '../BaseDialog';
import { Button } from 'primereact/button';

type IFileSelectorControlProps = IControlProps & FileControlProps & {
    removeFile?: Function;
}
// https://formik.org/docs/examples/dependent-fields
const FileSelectorControl = forwardRef((props: IFileSelectorControlProps, ref) => {
    const selectfileRef = useRef<any>(null);
    const [value, setValue] = useState(props.initialValue || null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectFile, setSelectFile] = useState(null);

    useEffect(() => {
        const newState = props.initialValue || null;
        if (!newState) {
            return;
        }
        const fetchData = async () => {
            await FileStorageService.findByIds(newState.split(";")).then(resp => {
                const respData = resp.data;
                if (respData.type == RESPONSE_TYPE.SUCCESS) {
                    const mapValue = {};
                    uploadedFiles.forEach(item => mapValue[item.uuid] = item);
                    respData.data.forEach(item => !mapValue[item.uuid] && uploadedFiles.unshift(item));
                    setUploadedFiles(_.cloneDeep(uploadedFiles));
                    setSelectFile(respData.data);
                }
            })
        }
        fetchData();
    }, [props.initialValue]);

    useEffect(() => {
        const parentFile = props.upstreamFiles || "";
        if (!parentFile) {
            return;
        }
        const fetchData = async () => {
            await FileStorageService.findByIds(parentFile.split(";")).then(resp => {
                const respData = resp.data;
                if (respData.type == RESPONSE_TYPE.SUCCESS) {
                    const mapValue = {};
                    uploadedFiles.forEach(item => mapValue[item.uuid] = item);
                    respData.data.forEach(item => !mapValue[item.uuid] && uploadedFiles.push(item));
                    setUploadedFiles(_.cloneDeep(uploadedFiles));
                }
            })
        }
        fetchData();
    }, [props.upstreamFiles])

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
                let preValue = _.cloneDeep(value);
                await Promise.all(listPromise).then(resp => {
                    resp?.forEach(item => {
                        const result = item?.data;
                        if (result?.type == RESPONSE_TYPE.SUCCESS) {
                            Array.isArray(preValue) ? preValue.push(result.data.url) : [preValue].push(result.data.url)
                            preUploadFiles.push(result.data);
                        }
                    })
                    setUploadedFiles(_.cloneDeep(preUploadFiles));
                    setValue(_.cloneDeep({ ...preValue}));
                    // props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, preValue.join(";"));
                });
            }
        };
        input.click();
    }

    const onShowSelectFile = () => {
        selectfileRef.current && selectfileRef.current.show();
    }

    const onSelectFiles = (file: any) => {
        if (props.multiple) {
            const _temp = Array.isArray(selectFile) ? selectFile : [];
            const index = _temp.findIndex(ele => ele?.uuid == file?.uuid);
            if (index !== -1) {
                _temp.splice(index, 1);
            } else {
                _temp.push(file);
            }
            setSelectFile(_.cloneDeep(_temp));
        } else {
            setSelectFile(file);
        }
    }

    const isActive = (file: any) => {
        if (props.multiple) {
            const _temp =Array.isArray(selectFile) ? selectFile : [];
            const index = _temp?.findIndex(ele => ele?.uuid == file?.uuid);
            return index !== -1 ? true : false;
        }
        return selectFile?.uuid == file?.uuid
    }

    const onSaveSelectFile = () => {
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, selectFile.map(item => item.uuid).join(";"));
        selectfileRef.current && selectfileRef.current.hide();
    }

    const footer = () => {
        return (
            <>
                <div className="btn-group">
                    <Button
                        label="Đóng"
                        className="p-button-danger"
                        onClick={() => { selectfileRef.current && selectfileRef.current.hide(); }}
                    />
                    <Button
                        label="Lưu lại"
                        onClick={onSaveSelectFile}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center">
                {
                    selectFile && selectFile.length ?
                    <React.Fragment>
                        <img onClick={onShowSelectFile} width={80} height={80} src={selectFile[0].url} />
                    </React.Fragment> :
                    <div onClick={onShowSelectFile} style={{ width: '80px', height: '80px', border: '1px dashed #D3D5D7' }} className="flex align-items-center justify-content-center flex-column">
                        <i className="pi pi-image" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                    </div>
                }
                <a data-tip="Chọn ảnh" onClick={onShowSelectFile} style={{ cursor: 'pointer', fontSize: '12px' }}>
                    Chọn ảnh
                </a>
                <BaseDialog
                    ref={selectfileRef}
                    header="Chọn ảnh"
                    footer={footer}
                    onHide={() => { }}
                >
                    <div className={`file-wrap ${uploadedFiles.length ? 'justify-content-start flex-wrap' : ''}`}>
                    { uploadedFiles.length > 0 &&
                        <div className="item" style={{ boxShadow: 'unset', border: '1px dashed #D3D5D7'}} onClick={openDialogSelectFile}>
                            <i className="pi pi-plus"></i>
                        </div>
                    }
                    {
                        uploadedFiles.length ? uploadedFiles.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <div className={`item${isActive(item) ? ' active' : ''}`} onClick={() => { onSelectFiles(item) }}>
                                        <div style={{ backgroundImage: `url(${item.url})` }}>
                                        </div>
                                        <span className="close" onClick={() => removeFile(item)}>
                                            <i className="pi pi-times"></i>
                                        </span>
                                        <span className="check">
                                            <i className="pi pi-check"></i>
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
                </div>
                </BaseDialog>
                <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
            </div>
        </>
    )
});


export default FileSelectorControl;
