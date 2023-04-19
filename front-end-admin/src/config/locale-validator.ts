/**
 * Custom thông báo lỗi validate
 */
import * as yup from 'yup';
import { AnyObject, Maybe } from 'yup/lib/types';
import { translate } from 'react-jhipster';
yup.setLocale({
    mixed: {
        required: () => ({ key: 'common.validateRequired' }),
    },
    string: {
        min: ({ min }) => ({ key: 'common.validateMinLength', values: { min } }),
        max: ({ max }) => ({ key: 'common.validateMaxLength', values: { max } }),
    },
    number: {
        min: ({ min }) => ({ key: 'common.validateMinNumber', values: { min } }),
        max: ({ max }) => ({ key: 'common.validateMaxNumber', values: { max } }),
    }
});

declare module 'yup' {
    // interface StringSchema<TType extends Maybe<string> = string | undefined,
    //     TContext extends AnyObject = AnyObject,
    //     TOut extends TType = TType,
    //     > extends yup.BaseSchema<TType, TContext, TOut> {
    //     title(local: 'en' | 'bn'): StringSchema<TType, TContext>;
    // }
    interface DateSchema<TType extends Maybe<Date> = Date | undefined,
        TContext extends AnyObject = AnyObject,
        TOut extends TType = TType,
        > extends yup.BaseSchema<TType, TContext, TOut> {
        format(format: string): DateSchema<TType, TContext>;
    }
    // interface ArraySchema<TType extends Maybe<any> = any | undefined,
    //     TContext extends AnyObject = AnyObject,
    //     TOut extends TType = TType,
    //     > extends yup.BaseSchema<TType, TContext, TOut> {
    //     format(format: string): ArraySchema<any, TContext>;
    // }
}
yup.addMethod<yup.DateSchema>(yup.date, "format", function (format: string) {
    return this.transform((value: yup.DateSchema, input: string) => {
        if (!input) {
            return undefined;
        };
        //const parsed = moment(input, format, true);
        return 'invalidDate';
    });
});

export class ValidationUtils {
    /**
     * fileField
     * @param isRequired
     * @returns
     */
    public static controlFile = (isRequired = false): any => {
        return {
            validate: (value: any): string | undefined => {
                let message = undefined;
                const files = value;
                if (isRequired && (!files || files.length == 0)) {
                    return translate('common.validateRequired');
                }
                if (files && files.length > 0) {
                    for (let i = 0; i < files.length; i++) {
                        const { file, secretId, _meta } = files[i];
                        if (!file) {
                            continue;
                        }
                        const accept = _meta.accept;
                        const maxFileSize = _meta.maxFileSize;
                        if (accept) {
                            const ext = file.name.split('.').pop();
                            if (accept.indexOf(`.${ext}`) <= 0) {
                                message = translate('common.validateFileAccept', { accept: accept });
                                _meta.isError = true;
                            }
                        }
                        if (maxFileSize && file.size > maxFileSize * 1024 * 1024) {
                            message = translate('common.validateMaxFileSize', { maxFileSize: `${maxFileSize}MB` });
                            _meta.isError = true;
                        }
                    }
                }
                return message;
            },
        }
    }
}