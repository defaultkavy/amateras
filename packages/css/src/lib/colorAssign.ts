import { Utils } from '@amateras/utils';

export const colorAssign = (key: string, colors: {[key: number]: string}) => {
    if (!$.color) Utils.assign($, {color: {}});
    Utils.assign($.color, {[key]: colors})
}