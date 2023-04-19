import axios from 'axios';

import { SUCCESS } from './action-type.util';

export const ACTION_TYPES = {
    GET_PROFILE: 'applicationProfile/GET_PROFILE',
    SERVER_ERROR: 'applicationProfile/SERVER_ERROR'
};

const initialState = {
    ribbonEnv: '',
    inProduction: true,
    tenant: '',
    messageError: null,
};

export type ApplicationProfileState = Readonly<typeof initialState>;

export default (state: ApplicationProfileState = initialState, action): ApplicationProfileState => {
    if (action.type === SUCCESS(ACTION_TYPES.GET_PROFILE)) {
        const { data } = action.payload;
        return {
            ...state,
            ribbonEnv: data['display-ribbon-on-profiles'],
            inProduction: data.activeProfiles.includes('prod'),
            tenant: window.location.pathname.split('/')[1]
        };
    } else if (action.type === ACTION_TYPES.SERVER_ERROR) {
        return {
            ...state,
            messageError: action.payload
        };
    } else {
        return {
            ...state,
            tenant: window.location.pathname.split('/')[1]
        };
    }
};

export const getProfile = () => ({
    type: ACTION_TYPES.GET_PROFILE,
    payload: axios.get('management/info')
});

export const serverError = (messageError) => ({
    type: ACTION_TYPES.SERVER_ERROR,
    payload: messageError
});
