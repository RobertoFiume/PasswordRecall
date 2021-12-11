import AsyncStorage from '@react-native-community/async-storage';
import useApi from './useApi';

const objectsEqual = (o1: any, o2: any) =>
    Object.keys(o1).length === Object.keys(o2).length
    && Object.keys(o1).every(p => o1[p] === o2[p]);

function arraysEqual(a: any, b: any) { return !!a && !!b && !(a < b || b < a); }

function PersistenceApiUtils(apiCall: Promise<any>, storageKey: string, callback: any, reject: any) {
    AsyncStorage.getItem(storageKey)
        .then((res: any) => {
            if (res) {
                // const tmp = JSON.parse(res);
                callback(JSON.parse(res));
                console.debug('CACHE:', storageKey, 'from local');
            }
            return JSON.parse(res);
        })
        .then((cacheRes: any) => {
            console.debug(apiCall)
            apiCall
                .then((apiRes: any) => {

                    var isEquals = false;
                    if (Array.isArray(cacheRes)) {
                        if (cacheRes != null && cacheRes != [] && arraysEqual(cacheRes, apiRes)) {
                            isEquals = true;
                        }
                    } else {
                        if (cacheRes != null && cacheRes != {} && objectsEqual(cacheRes, apiRes)) {
                            isEquals = true;
                        }
                    }

                    if (isEquals) {
                        // console.log('CACHE:', storageKey, 'diff', cacheRes == [], !arraysEqual(cacheRes, apiRes), !objectsEqual(cacheRes, apiRes));
                        console.debug('CACHE:', storageKey, 'local and remote are the same')
                    } else {
                        callback(apiRes);
                        // console.log('CACHE:', storageKey, 'from remote is different', cacheRes == [], !arraysEqual(cacheRes, apiRes), !objectsEqual(cacheRes, apiRes));
                        AsyncStorage.setItem(storageKey, JSON.stringify(apiRes)).then(() => {
                            console.debug('CACHE:', storageKey, 'save local');
                        });
                        // callback(apiRes);
                    }
                })
                .catch(reject);
        })
        .catch((error: any) => { console.error('CACHE:', storageKey, error) })
}

const usePersistenceApi = {
    // login(username: string, password: string, langstr?: string, mandant?: number) {

    // },

    getExpenses(callback: any, reject: any) {
        PersistenceApiUtils(useApi.getExpenses(), 'getExpenses', callback, reject);
    },

    getExpensesArchive(callback: any, reject: any) {
        PersistenceApiUtils(useApi.getExpensesArchive(), 'getExpensesArchive', callback, reject);
    },

    getExpensesDetail(id: string) {
        // details will not be cached
    },

    getExpenseTypes(callback: any, reject: any) {
        PersistenceApiUtils(useApi.getExpenseTypes(), 'getExpenseTypes', callback, reject);
    },

    getPaymentsTypes(callback: any, reject: any) {
        PersistenceApiUtils(useApi.getPaymentsTypes(), 'getPaymentsTypes', callback, reject);
    },

    getCurrencies(callback: any, reject: any) {
        PersistenceApiUtils(useApi.getCurrencies(), 'getCurrencies', callback, reject);
    },

    getSettings(callback: any, reject: any) {
        PersistenceApiUtils(useApi.getSettings(), 'getSettings', callback, reject);
    },

    getCustomers(callback: any, reject: any) {
        PersistenceApiUtils(useApi.getCustomers(), 'getCustomers', callback, reject);
    },

    // postExpense(newExpense: PostExpense) {

    // },

    // putExpense(newExpense: PostExpense) {

    // },

    // deleteExpense(id: string) {

    // }
}

export default usePersistenceApi;
