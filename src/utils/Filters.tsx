import moment from 'moment'
import 'moment/locale/it'
import 'moment/locale/de'
import { Expense } from '../types';

export const groupByDate = (list: Expense[], lang: string) => {
    var groups: any = {};
    list.forEach(function (val: Expense) {
        var date = moment(new Date(val.date)).locale([lang]).format('MMMM YYYY')
        if (date in groups) {
            groups[date].data.push(val);

            const split = val.price.split(' ');
            const symbol = split[1]
            if (groups[date].symbol != undefined && groups[date].symbol == symbol) {
                groups[date].sum += Number(split[0].replace(/\,/g, '.'))
            } else
                groups[date].symbol = undefined;

        } else {
            groups[date] = {}
            groups[date].data = new Array(val);
            const split = val.price.split(' ');
            groups[date].sum = Number(split[0].replace(/\,/g, '.'));
            groups[date].symbol = split[1];
        }
    });
    return groups;
}
