import { useFormik } from "formik";
import _ from "lodash";
import { FAILURE, REQUEST, SUCCESS } from "../reducers/action-type.util";
import { ActionType } from "src/@types/enums";
import moment from "moment";
import { confirmDialog } from "primereact/confirmdialog";
import { Storage, translate } from "react-jhipster";
import { Crypto } from "./crypto";
import { Filter } from "src/@types/entity/global-model";
import { SyntheticEvent } from "react";

export const JSON_STRINGIFY = (s: any) => {
    return JSON.stringify(typeof s === 'undefined' ? null : s).replace(/"(\w+)"\s*:/g, '$1:');
};
export class CommonUtil {
    static assignState = (state: any, params: any) => {
        _.assign(state, params);
    };

    static excuteFunction = (type, state, action, failure, succces) => {
        switch (action.type) {
            case REQUEST(type):
                CommonUtil.assignState(state, {
                    action: ActionType.Request
                });
                return { ...state };
            case FAILURE(type):
                if (failure) return failure();
                CommonUtil.assignState(state, {
                    errorMessage: action.payload,
                    suscessMessage: null,
                    action: ActionType.Error
                });
                return { ...state };
            case SUCCESS(type):
                return succces();
            default:
                return null;
        }
    };
    static NVL = (value: any, valueDefault?: any) => {
        return value === undefined
            ? valueDefault === undefined
                ? null
                : JSON_STRINGIFY(valueDefault)
            : JSON_STRINGIFY(value);
    };

    static buildParams = (obj) => {
        return Object.entries(obj || {})
            .reduce((params, [key, value]) => {
                if (value === null || value === undefined) {
                    params[key] = String('');
                    return params;
                } else if (typeof value === typeof {}) {
                    params[key] = JSON.stringify(value);
                    return params;
                } else {
                    params[key] = String(value);
                    return params;
                }
            }, {});
    }

    static confirmDelete = (accept: Function, reject?: Function, message?: string) => {
        confirmDialog({
            message: message || translate('common.confirmDelete'),
            header: translate('common.confirm'),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: translate('common.acceptLabel'),
            rejectLabel: translate('common.rejectLabel'),
            accept: () => {
                accept();
            },
            reject: () => {
                reject && reject();
            }
        });
    }

    static confirmSaveOrUpdate = (accept: Function, reject?: Function, message?: string) => {
        confirmDialog({
            message: message ? message : translate('common.confirmSaveOrUpdate'),
            header: translate('common.confirm'),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: translate('common.acceptLabel'),
            rejectLabel: translate('common.rejectLabel'),
            className: 'p-confirm',
            accept: () => {
                accept();
            },
            reject: () => {
                reject && reject();
            }
        });
    }

    static confirmDeleteCartItem = async (accept: Function, reject?: Function, message?: string) => {
        confirmDialog({
            message: message ? message : translate('common.confirmDelete'),
            header: 'Bạn chắc chắn muốn bỏ sản phẩm này ?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: translate('common.acceptLabel'),
            rejectLabel: translate('common.rejectLabel'),
            className: 'p-confirm',
            accept: async () => {
                await accept();
            },
            reject: () => {
                reject && reject();
            }
        });
    }

    static viewFileSize = (bytes, si = false, dp = 1) => {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

        return bytes.toFixed(dp) + ' ' + units[u];
    }

    static convertFormFile = (dataPost: any): FormData => {
        const filteredData = CommonUtil.convertData(dataPost);
        const formData = CommonUtil.objectToFormData(filteredData, '', []);
        return formData;
    }


    /**
   * objectToFormData
   */
    static objectToFormData = (obj: any, rootName: any, ignoreList: any): FormData => {
        const formData = new FormData();
        function appendFormData(data: any, root: any): void {
            if (!ignore(root)) {
                root = root || '';
                if (data instanceof File) {
                    if (data.type !== 'stored_file') {
                        formData.append(root, data);
                    }
                } else if (Array.isArray(data)) {
                    let index = 0;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i] instanceof File) {
                            if (data[i].type !== 'stored_file') {
                                // appendFormData(data[i], root + '[' + index + ']');
                                appendFormData(data[i], root);
                                index++;
                            }
                        } else if (data[i] && typeof data[i] === 'object') {
                            appendFormData(data[i], root + '[' + i + ']');
                        } else {
                            appendFormData(data[i], root);
                        }
                    }
                } else if (data && data instanceof Date) {
                    formData.append(root, data.toISOString());
                } else if (data && typeof data === 'object' && data.type !== 'stored_file') {
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            // if (root === '') {
                            //     appendFormData(data[key], `[${key}]`);
                            // } else {
                            //     appendFormData(data[key], `${root}[${key}]`);
                            // }
                            if (root === '') {
                                appendFormData(data[key], `${key}`);
                            } else {
                                appendFormData(data[key], `${root}.${key}`);
                            }
                        }
                    }
                } else {
                    if (data !== null && typeof data !== 'undefined' && data.type !== 'stored_file') {
                        formData.append(root, data);
                    }
                }
            }
        }

        function ignore(root: any): any {
            return Array.isArray(ignoreList) && ignoreList.some(x => x === root);
        }

        appendFormData(obj, rootName);
        return formData;
    }

    /**
 * convertData
 */
    static convertData = (data: any): any => {
        if (typeof data === typeof {}) {
            return data;
        } else if (typeof data === typeof []) {
            return CommonUtil.convertDataArray(data);
        } else if (typeof data === typeof true) {
            return CommonUtil.convertBoolean(data);
        }
        return data;
    }

    static convertDataArray = (data: Array<any>): Array<any> => {
        if (data && data.length > 0) {
            // tslint:disable-next-line: forin
            for (const i in data) {
                data[i] = CommonUtil.convertData(data[i]);
            }
        }
        return data;
    }

    static convertBoolean = (value: boolean): number => {
        return value ? 1 : 0;
    }

    static generateUniqueId = () => {
        return Math.random()
            .toString(36)
            .substring(2);
    }

    static renderDateColumn = (rowData, column, format = 'DD/MM/YYYY') => {
        const value = rowData[column.field];
        if (!value) {
            return '';
        }
        return moment(value).format(format);
    }
    static convertDateToString = (time, format = 'DD/MM/YYYY') => {
        if (!time) {
            return '';
        }
        return moment(time).format(format);
    }

    static _getChildMenu = (listItemMenu: any, parentId: any) => {
        if (!listItemMenu) {
            return [];
        }
        const menu = listItemMenu.filter(e => e.parentId == parentId) || [];
        menu.forEach(el => {
            el['label'] = el.name;
            el['value'] = el.code;
            // el['icon'] = ICON_MENU[el.code];
            const items = CommonUtil._getChildMenu(listItemMenu, el.sysMenuId);
            el.items = items?.length > 0 ? items : null;
        });
        return menu
    }

    static computeMenu = (listItemMenu: any) => {
        return CommonUtil._getChildMenu(listItemMenu, null);
    }

    static setSessionStorage = (key, value) => {
        Storage.session.set(key, Crypto.encr(value));
    }

    static getSessionStorage = (key) => {
        return Crypto.decr(Storage.session.get(key));
    }

    static setLocalStorage = (key, value) => {
        Storage.local.set(key, Crypto.encr(value));
    }

    static getLocalStorage = (key) => {
        const exitsDataByKey = Storage.local.get(key) || null;
        if (!exitsDataByKey) return null;
        return Crypto.decr(Storage.local.get(key));
    }

    static computeError = (module, res) => {
        res = res || {};
        const error = {};
        for (const [key, value] of Object.entries(res)) {
            error[key] = translate(`${module}.error.${value}_${key}`);
        }
        return error;
    }

    static buildSearchCondition = (defaultFilter) => {
        if (!defaultFilter) {
            return { limit: Number.MAX_SAFE_INTEGER };
        }
        const condition = { limit: Number.MAX_SAFE_INTEGER };
        const { filters, order } = defaultFilter;
        if (filters) {
            const where = {};
            filters.forEach((filter: Filter) => {
                where[filter.key] = {};
                where[filter.key][filter.operator] = filter.value;
            });
            condition['where'] = where;
        }
        if (order) {
            condition['sort'] = `${order.key} ${order.direction}`
        }
        return condition;
    }

    static formatNumber(value: number) {
        return value ? value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') : '';
    }

    static convertDataError(err) {
        const error = {};
        if (err) {
            for (const key in err) {
                const field = err[key];
                error[key] = field;
            }
        }
        return error;
    }

    static getObjectCompareChange = (oldObject, object) => {
        let newObject = { attributeDelete: [] };
        Object.keys(oldObject).forEach(x => {
            if (oldObject[x] != object[x]) {
                if (Array.isArray(object[x])) {
                    if (JSON.stringify(object[x]) != JSON.stringify(oldObject[x])) {
                        newObject[x] = object[x];
                    }
                } else if (Object.prototype.toString.call(object[x]) === "[object Date]") {
                    const oldDate = oldObject[x] && typeof oldObject[x] === 'string' ? moment.utc(oldObject[x]).toDate() : oldObject[x];
                    if (object[x]?.getTime() != oldDate?.getTime()) {
                        newObject[x] = object[x];
                    }
                } else {
                    newObject[x] = object[x];
                }
                if (object[x] == null) {
                    newObject.attributeDelete.push(x);
                }
            }

        })
        return newObject;
    }

    static decodeParamForKey = (paramString, key) => {
        return decodeURIComponent(
            paramString.replace(
                new RegExp(
                    '^(?:.*[&\\?]' +
                    encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') +
                    '(?:\\=([^&]*))?)?.*$', 'i'
                ),
                '$1'
            )
        );
    }

    static objectToParams = (params) => '?' + Object.keys(params)
        .map(param => `${param}=${encodeURIComponent(params[param])}`)
        .join('&');

    /**
     * Check 1 trường có lỗi hay không
     * @param {*} errors
     * @param {*} touched
     * @param {*} name
     * @return {*}
     */
     static isFormFieldValid = (errors: any, touched: any, name: string) => {
        const _touched = _.get(touched, name);
        const _error = _.get(errors, name);
        return !!(_touched && _error);
    };
    /**
     * Lấy thông báo lỗi validate
     * @param {*} errors
     * @param {*} name
     * @return {*}
     */
    static getFormErrorMessage = (errors: any, name: string) => {
        const error = _.get(errors, name) as any;
        let msg = '';
        if (typeof error == 'object') {
            if (error.key) {
                msg = translate(error.key, error.values);
            }
        } else {
            msg = error || '';
        }
        return msg;
    };
    /**
     * Scroll lên phần tử đầu tiên submit
     * @param event
     * @param defaultHandleSubmit
    */
    static focusOnSubmitError(event: SyntheticEvent<HTMLFormElement>, defaultHandleSubmit: Function) {
        defaultHandleSubmit(event); // formik validate and submit
        // thực hiện scroll to phần tử đầu tiên bị lỗi nếu có
        setTimeout(() => {
            // focus và scroll to element đầu tiên bị lỗi sau 100ms
            const html = event.target as HTMLInputElement;
            const element = html.querySelector('.p-invalid');
            console.log(">>> element: ", element);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {// thực hiện focus vào phần tử lỗi
                if (element?.classList.contains('p-dropdown')) {
                    (element as HTMLElement)?.click();
                } else if (element?.classList.contains('p-calendar')) {
                    const inputElement = element.querySelector('input');
                    inputElement?.focus();
                } else {
                    (element as HTMLElement)?.focus();
                }
            }, 400);
        }, 100)
    }

    static formatMoney = (value: any) => {
        return value ? `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ` : `0đ`;
    }

    static percentValue = (finalPrice: number, salePrice: number) => {
        if (!finalPrice || !salePrice) return null;
        return 100 - Math.ceil((salePrice / finalPrice) * 100);
    }

    static isNullOrEmpty = (str: any): boolean => {
        return !str || (str + '').trim() === '';
    }

    static isEmpty = (array?: Array<any>) => {
        if (this.isNullOrEmpty(array) || Array.isArray(array) && array.length === 0) return true;
        return false;
    }

    static getKeyByValue = (object, value) => {
        return Object.keys(object).find(key => object[key] == value);
    }
}
