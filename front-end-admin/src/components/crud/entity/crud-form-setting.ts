export class CrudFormSetting {
    formType: 'save' | 'search' = 'save';
    formControls: any[] = [];
    validators: any[] = [];
    viewMode: 'insert' | 'edit' | 'view' | '' = '';
    constructor(init?: Partial<CrudFormSetting>) {
        Object.assign(this, init);
    }
}
