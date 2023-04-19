import { BaseService } from './base.services';
import axios from 'axios';
import _ from 'lodash';

export class TreeSelectorService extends BaseService {
    constructor() {
        super('', 'treeSelector');
    }

    public lazyLoadTree(parentId: Number, treeSelectorOptions: any) {
        return axios.post(`${this.baseUrl}/lazyLoadTree`, { parentId: parentId, treeSelectorOptions: treeSelectorOptions });
    }

    public searchGrid(formData, event?) {
        formData = _.cloneDeep(formData || {});
        formData['_search'] = event;
        return axios.post(`${this.baseUrl}/searchGrid`, formData);
    }

    public findTreeSelectorById(id, treeSelectorOptions) {
        return axios.post(`${this.baseUrl}/${id}`, { treeSelectorOptions: treeSelectorOptions });
    }
}

export default new TreeSelectorService();