import { TranslatorContext, Storage } from 'react-jhipster';
import { LOCALE_DEFAULT } from '../constants/constants';
import { setLocale } from '../reducers/locale';
TranslatorContext.setDefaultLocale(LOCALE_DEFAULT);
TranslatorContext.setRenderInnerTextForMissingKeys(false);

export const registerLocale = (store: any) => {
    store.dispatch(setLocale(Storage.session.get('locale', LOCALE_DEFAULT)));
};
