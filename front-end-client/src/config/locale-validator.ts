/**
 * Custom thông báo lỗi validate
 */
import { setLocale } from 'yup';
setLocale({
mixed: {
    required: () => ({ key: 'common.validateRequired' }),
},
string: {
    min: ({ min }) => ({ key: 'common.validateMinLength', values: { min } }),
    max: ({ max }) => ({ key: 'common.validateMaxLength', values: { max } }),
}
});
