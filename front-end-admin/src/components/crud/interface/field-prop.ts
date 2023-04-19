import { FilterModel } from "../../crud/entity/crud-model";

export interface IFieldProps {
    formik?: any; // form data
    id?: any;
    fieldName?: string; // field name
    isFocus?: boolean; // if set focus
    required?: boolean; // display required icon
    disabled?: boolean; // control disabled?
    showFieldLabel?: boolean; // show field label
    errorInfo?: {}; // error object
    defaultValue?: any; // default value
    placeholder?: string; // placeholder
    maxLength?: number; // maxLength
    updateStateElement?: (
        fieldName?: string,
        extEditValue?: any
    ) => void; // callback when change status control
    onChange?: Function; // onChange
    fieldLabel?: string;
    fieldValue?: string;
    datasource?: any;
    baseService?: any;
    groupCode?: any;
    codeType?: string;
    isSearchForm?: boolean;
    multiple?: boolean;
    acceptType?: string;
    fieldPath?: string;
    defaultFilter?: FilterModel;
    extraField?: Array<string>;
    renderLabel?: Function;
    dependencies?: Array<string>;
    modifyFilter?: (filters: FilterModel) => void;
    callbackValueChange?: Function;
    suffixesIcon?: string;
    rateValue?: any;
    suffixesContent?: string;
    setValueDirectly?: Function;
    onlyView?: boolean;
    textAlign?: string;
    meter?: boolean;
    showControl?: boolean;
    selectedFirst?: boolean;
}