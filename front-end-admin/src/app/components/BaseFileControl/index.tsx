import React, { forwardRef, useState, useEffect, useMemo } from 'react';
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/reducers';
import { IControlProps } from 'src/@types/interfaces/control-props';
import { FileControlProps } from 'src/@types/interfaces/file-control-props';
import { CommonUtil } from 'src/utils/common-util';
import ErrorMessage from 'src/components/error/ErrorMessage';
import FileStorageService from 'src/services/file-storage.services';
import { RESPONSE_TYPE } from 'src/enum';
import _ from 'lodash';
import saveAs from 'save-as';
import { log } from 'console';
type FiletControlProps = StateProps & DispatchProps & FileControlProps & IControlProps & {
}

const FileControl = forwardRef((props: FiletControlProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || []);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const controlId = props.id || props.property;

    const {errors, touched, property, labelKey, initialValue, fieldPath, required, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return CommonUtil.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    // useEffect(() => {
    //     props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, value);
    // }, [value]);

    useEffect(() => {
        const newState = props.initialValue || [];
        if (!newState || !newState.length) {
            return;
        }
        const fetchData = async () => {
            await FileStorageService.findByIds(newState.split(";")).then(resp => {
                const respData = resp.data;
                if (respData.type == RESPONSE_TYPE.SUCCESS) {
                    setUploadedFiles(respData.data);
                    setValue(respData.data.map(item => item.uuid));
                }
            })
        }
        fetchData();
    },[props.initialValue])



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
            const preUploadFiles = uploadedFiles;
            const listPromise = [];
            const listFile = Object.values(evt.currentTarget.files);
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
                        Array.isArray(preValue) ? preValue.push(result.data.uuid) : [preValue].push(result.data.uuid)
                        preUploadFiles.push(result.data);
                    }
                })
                setUploadedFiles(_.cloneDeep(preUploadFiles));
                setValue(_.cloneDeep({
                    ...preValue,
                    // upstreamFile: uploadedFiles
                }));
                props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, preValue.join(";"));
            });
        };
        input.click();
    }

    const removeFile = async (file) => {
        const idx = uploadedFiles.findIndex(e => e.uuid == file.uuid);
        if (idx > -1) {
            await FileStorageService.removeFileByUUID(uploadedFiles[idx]?.uuid).then(resp => {
                if (resp.data.type == RESPONSE_TYPE.SUCCESS) {
                    uploadedFiles.splice(idx, 1);
                    setUploadedFiles(_.cloneDeep(uploadedFiles));
                    const newValue = uploadedFiles.map(item => item.uuid).join(";");
                    props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
                }
            })
        }
    }

    const downloadFile = async (file) => {
        await FileStorageService.download(file.uuid).then(res => {
            saveAs(res.data, file.name);
        });
    }

    const onChange = (e: any) => {
        setValue(e?.target?.value);
    };

return (
    <>
        {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{props.labelKey}</label> : ''}
        <div className='form-control-wrap'>
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
            </div>
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
    </>
    );
})
FileControl.displayName = 'FileControl';

FileControl.defaultProps = {
    acceptType: "image/*"
}

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
)(FileControl);