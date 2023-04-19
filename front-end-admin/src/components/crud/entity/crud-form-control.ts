import { FilterModel } from "./crud-model";

export class CrudFormControl {
    field?= '';
    title = '';
    value?: any;
    validators: any[] = [];
    required = false;
    mdWidth?: 3 | 4 | 6 | 12 = 12;
    width: number = 100;
    isWidthDynamic = false;
    viewAble = true;
    formControlType?: 'textbox' | 'password' | 'textarea' | 'datetime' | 'select' | 'multiSelect' | 'radio' | 'checkbox' | 'title' | 'divider'
        | 'primaryKey' | 'text' | 'dateRange' | 'file' | 'customFormControl' | 'index' | 'action' | 'number' | 'orgSelector'
        | 'arrayForm' | 'inputSwitch' | 'treeSelector' | 'slider' | 'arrayFormCustom' | 'subForm' | 'datetimeRange' | 'incomeCustomsForm' | 'spaceFormControl' | 'fileCustom';
    textAlign: 'left' | 'center' | 'right' = 'left';
    callbackValueChange?: Function;
    disabled?= false;
    readOnly = false;
    hidden?= false;
    show?= true;
    hiddenOnPopup?= false;
    isViewInHeaderEdit?= false;
    isEditInRowTable?= false;
    format?: 'formatCurrency';
    isGroupColumn = false;
    isFocus?: boolean;
    defaultValue?: any; // default value
    checkShowControl?: Function;
    fieldPath?: string;
    customContent: any;
    suffixesIcon?: string;
    placeholder?: string;
    fieldFrom?= '';
    fieldTo?= '';
    titleForm?: string;
    titleTo?: string;
    setValueDirectly?: Function;
    requiredFrom = false;
    requiredTo = false;
    meter?= false;
    isRow?= true;
    constructor(init?: Partial<CrudFormControl>) {
        Object.assign(this, init);
    }
}
export class IncomeCustomsFormControl {
    field = '';
    title = '';
    formControls: any[] = [];
    formControlType = 'incomeCustomsForm';
    numberOfMonths?: | 6 | 12;
    mdWidth?: 3 | 4 | 6 | 12;
    allowAdd = true;
    allowEdit = false;
    allowDelete = true;
    listDataSelected: any[] = [];
    callbackDeleteRow?: Function;
    actionAddNewRow?: Function;
    actionEditRow?: Function;
    actionAfterAddEditRow?: Function;
    registerCustomForm: any[] = [];
    modeInsert: 'inPopup' | 'inTable' = 'inTable';
    colGroup = '';
    colGroupMetadata: any = {};
    constructor(init?: Partial<IncomeCustomsFormControl>) {
        Object.assign(this, init);
    }
}
export class SubFormControl {
    field = '';
    title = '';
    formControls: any[] = [];
    formControlType = 'subForm';
    mdWidth?: 3 | 4 | 6 | 12;
    allowAdd = true;
    allowEdit = false;
    allowDelete = true;
    listDataSelected: any[] = [];
    callbackDeleteRow?: Function;
    actionAddNewRow?: Function;
    actionEditRow?: Function;
    actionAfterAddEditRow?: Function;
    registerCustomForm: any[] = [];
    modeInsert: 'inPopup' | 'inTable' = 'inTable';
    colGroup = '';
    colGroupMetadata: any = {};
    constructor(init?: Partial<ArrayFormControl>) {
        Object.assign(this, init);
    }
}
export class TextFormControl extends CrudFormControl {
    maxLength?: number;
    rateValue?: any;
    suffixesContent?: string;
    constructor(init?: Partial<TextFormControl>) {
        super({
            formControlType: 'textbox'
        });
        Object.assign(this, init);
    }
}
export class PasswordFormControl extends CrudFormControl {
    maxLength?: number;
    rateValue?: any;
    suffixesContent?: string;
    meter?: boolean;
    constructor(init?: Partial<PasswordFormControl>) {
        super({
            formControlType: 'password'
        });
        Object.assign(this, init);
    }
}
export class TextAreaFormControl extends CrudFormControl {
    maxLength?: number;
    constructor(init?: Partial<TextFormControl>) {
        super({
            formControlType: 'textarea'
        });
        Object.assign(this, init);
    }
}

export class SpaceFormControl extends CrudFormControl {
    constructor(init?: Partial<TextFormControl>) {
        super({
            formControlType: 'spaceFormControl'
        });
        Object.assign(this, init);
    }
}

export class NumbericFormControl extends CrudFormControl {
    max?: number;
    min?: number;
    constructor(init?: Partial<TextFormControl>) {
        super({
            formControlType: 'number'
        });
        Object.assign(this, init);
    }
}

export class DropDownFormControl extends CrudFormControl {
    baseService: any;
    datasource?: any;
    fieldLabel: string;
    fieldValue: string;
    groupCode?: any;
    codeType?: string;
    isSearchForm?: boolean;
    modifyFilter?: (filters: FilterModel) => void;
    renderLabel?: Function;
    defaultFilter?: FilterModel;
    extraField?: Array<string>;
    dependencies?: Array<string>;
    isMultiLanguage?: boolean;
    onlyView?: boolean;
    showControl = true;
    selectedFirst?: boolean;
    constructor(init?: Partial<DropDownFormControl>) {
        super({
            formControlType: 'select'
        });
        Object.assign(this, init);
    }
}

export class MultiSelectFormControl extends CrudFormControl {
    baseService: any;
    datasource?: any;
    fieldLabel: string;
    fieldValue: string;
    groupCode?: string;
    codeType?: string;
    isSearchForm?: boolean;
    modifyFilter?: (filters: FilterModel) => void;
    renderLabel?: Function;
    defaultFilter?: FilterModel;
    extraField?: Array<string>;
    dependencies?: Array<string>;
    isMultiLanguage?: boolean;
    constructor(init?: Partial<MultiSelectFormControl>) {
        super({
            formControlType: 'multiSelect'
        });
        Object.assign(this, init);
    }
}

export class DatetimeRangeFormControl extends CrudFormControl {
    minDateBy?: string;
    maxDateBy?: string;
    constructor(init?: Partial<DatetimeRangeFormControl>) {
        super({
            formControlType: 'datetimeRange'
        });
        Object.assign(this, init);
    }
}
export class DatetimeFormControl extends CrudFormControl {
    minDateBy?: string;
    maxDateBy?: string;
    constructor(init?: Partial<DatetimeFormControl>) {
        super({
            formControlType: 'datetime'
        });
        Object.assign(this, init);
    }
}
export class RadioFormControl extends CrudFormControl {
    datasource?: any;
    fieldLabel: string;
    fieldValue: string;
    isMultiLanguage?: boolean;
    constructor(init?: Partial<RadioFormControl>) {
        super({
            formControlType: 'radio'
        });
        Object.assign(this, init);
    }
}
export class OrgSelectorFormControl extends CrudFormControl {
    constructor(init?: Partial<OrgSelectorFormControl>) {
        super({
            formControlType: 'orgSelector'
        });
        Object.assign(this, init);
    }
}
export class TreeSelectorFormControl extends CrudFormControl {
    treeSelectorOptions?: any;
    fieldLabel: string;
    fieldValue: string;
    constructor(init?: Partial<TreeSelectorFormControl>) {
        super({
            formControlType: 'treeSelector'
        });
        Object.assign(this, init);
    }
}

export class FileFormControl extends CrudFormControl {
    multiple?: boolean = true;
    acceptType?: string;
    maxFileSize?: number;
    constructor(init?: Partial<FileFormControl>) {
        super({
            formControlType: 'file'
        });
        Object.assign(this, init);
    }
}
export class CustomFileFormControl extends CrudFormControl {
    multiple?: boolean = true;
    acceptType?: string;
    maxFileSize?: number;
    constructor(init?: Partial<FileFormControl>) {
        super({
            formControlType: 'fileCustom'
        });
        Object.assign(this, init);
    }
}
export class CustomFormControl extends CrudFormControl {
    renderTempalte: Function;
    constructor(init?: Partial<CustomFormControl>) {
        super({
            formControlType: 'customFormControl'
        });
        Object.assign(this, init);
    }
}
export class InputSwitchControl extends CrudFormControl {
    constructor(init?: Partial<InputSwitchControl>) {
        super({
            formControlType: 'inputSwitch'
        });
        Object.assign(this, init);
    }
}

export class ArrayFormCustomControl {
    required = false;
    field = '';
    title = '';
    formControls: any[] = [];
    formControlType = 'arrayFormCustom';
    mdWidth?: 3 | 4 | 6 | 12;
    allowAdd = true;
    allowEdit = false;
    allowDelete = true;
    listDataSelected: any[] = [];
    callbackDeleteRow?: Function;
    actionAddNewRow?: Function;
    actionEditRow?: Function;
    actionAfterAddEditRow?: Function;
    registerCustomForm: any[] = [];
    modeInsert: 'inPopup' | 'inTable' = 'inTable';
    colGroup = '';
    colGroupMetadata: any = {};
    constructor(init?: Partial<ArrayFormCustomControl>) {
        Object.assign(this, init);
    }
}

export class ArrayFormControl {
    field = '';
    title = '';
    formControls: any[] = [];
    formControlType = 'arrayForm';
    mdWidth?: 3 | 4 | 6 | 12;
    allowAdd = true;
    allowEdit = false;
    allowDelete = true;
    listDataSelected: any[] = [];
    callbackDeleteRow?: Function;
    actionAddNewRow?: Function;
    actionEditRow?: Function;
    actionAfterAddEditRow?: Function;
    registerCustomForm: any[] = [];
    modeInsert: 'inPopup' | 'inTable' = 'inTable';
    colGroup = '';
    colGroupMetadata: any = {};
    constructor(init?: Partial<ArrayFormControl>) {
        Object.assign(this, init);
    }
}
export class TitleFormControl extends CrudFormControl {
    constructor(init?: Partial<TitleFormControl>) {
        super({
            formControlType: 'title'
        });
        Object.assign(this, init);
    }
}
export class SliderFormControl extends CrudFormControl {
    min?: number;
    max?: number;
    step?: number;
    unitTitle?: string;
    renderTextValue?: (value) => string;
    constructor(init?: Partial<SliderFormControl>) {
        super({
            formControlType: 'slider'
        });
        Object.assign(this, init);
    }
}
