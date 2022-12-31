//import { LicenseGlobals } from '@infominds/react-native-license';
import ImAnalytics from "../utils/ImAnalytics";
import ApiUtils from './ApiUtils';
import base64 from 'react-native-base64'
import {
    PaymentType, Expense, ExpenseDetail, ExpenseType, Currency, ServerSettings, Customer, PostExpense, PostImage, Company, FormRecognition
} from '../types';
import AsyncStorage from '@react-native-community/async-storage';

/*
function getExpenses(isHistory: boolean) {
    return new Promise<Expense[]>((resolve, reject) => {
        fetch(LicenseGlobals.baseUrl + "/api/expenses?IsHistory=" + isHistory, ApiUtils.createGetRequestOptions())
            .then(response => {
                console.log('response', response);
                return response.json()
            })
            .then(result => resolve(result))
            .catch(error => {
                console.error('error', error);
                reject(error);
            });
    })
}*/

const useApi = {
    login(username: string, password: string, langstr?: string, company?: string) {
        return new Promise(async (resolve, reject) => {
            console.debug('Custom login');
            console.log(password);

            // TODO remove
            if (!password)
                password = "123";

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            // myHeaders.append("Access-Control-Allow-Origin", "*");

            var request = { username: username, password: base64.encode(password) }
            if (langstr)
                //@ts-ignore
                request.language = langstr;
            else {
                var tmp = await AsyncStorage.getItem('lang')
                console.log(tmp)
                if (tmp)
                    //@ts-ignore
                    request.language = tmp;
            }


            if (company)
                //@ts-ignore
                request.code = company;
            else {
                var tmpCode = await AsyncStorage.getItem('code')
                if (tmpCode)
                    //@ts-ignore
                    request.code = tmpCode;
            }


            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(request)
            };

            console.log('login request', requestOptions.body)

            console.log(LicenseGlobals.baseUrl + '/api/AuthenticateApps/login/apps');
            fetch(LicenseGlobals.baseUrl + '/api/AuthenticateApps/login/apps', requestOptions)
                .then(response => {
                    if (response.status === 200 || response.status === 401)
                        return response.json();
                    else {
                        console.error(response)
                        throw new Error(response.statusText)
                    }
                })
                .then(result => {
                    console.log(result)
                    if (result?.message) {
                        throw new Error(result.message);
                    } else {
                        console.log('Bearer ' + result.token);
                        resolve('Bearer ' + result.token);
                        ImAnalytics.trackEvent("Login", { username });

                    }
                })
                .catch(error => {
                    console.error('Login error', error);
                    reject(error);
                });
        })
    },

    getExpenses() {
        return getExpenses(false);
    },

    getExpensesArchive() {
        return getExpenses(true)
    },

    getCompaniesOfUser() {
        return new Promise<Company[]>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/Companies", ApiUtils.createGetRequestOptions())
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    getExpensesDetail(id: string) {
        return new Promise<ExpenseDetail>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/expense?Id=" + id, ApiUtils.createGetRequestOptions())
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    getExpenseTypes() {
        return new Promise<ExpenseType[]>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/ExpenseType", ApiUtils.createGetRequestOptions())
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    getPaymentsTypes() {
        return new Promise<PaymentType[]>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/PaymentType", ApiUtils.createGetRequestOptions())
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    getCurrencies() {
        return new Promise<Currency[]>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/Currencies", ApiUtils.createGetRequestOptions())
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    getSettings() {
        return new Promise<ServerSettings>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/Settings", ApiUtils.createGetRequestOptions())
                .then(response => {

                    return response.json()
                })
                .then(result => {
                    console.log('test', result);
                    resolve(result)
                }
                )
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    getCustomers() {
        return new Promise<Customer[]>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/Customers", ApiUtils.createGetRequestOptions())
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    postExpense(newExpense: PostExpense) {
        return new Promise<any>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/Expenses", ApiUtils.createPostRequestOptions(newExpense))
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    putExpense(newExpense: PostExpense) {
        return new Promise<any>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/Expenses", ApiUtils.createPutRequestOptions(newExpense))
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    postImage(newImage: PostImage) {
        return new Promise<any>((resolve, reject) => {
            console.log('upload image');
            fetch(LicenseGlobals.baseUrl + "/api/Image", ApiUtils.createPostRequestOptions(newImage))
                .then(response => {
                    console.log(response)
                    return response.text
                })
                .then(result => resolve(Boolean(result)))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    deleteImage(imageId: string) {
        return new Promise<any>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/Image?Id=" + imageId, ApiUtils.createDeleteRequestOptions())
                .then(response => response.text())
                .then(result => resolve(Boolean(result)))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    getImageIds(id: string) {
        return new Promise<string[]>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/Images?MitSpeBewId=" + id, ApiUtils.createGetRequestOptions())
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    getImage(infoboxId: string) {
        return new Promise<string>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/Image?Id=" + infoboxId, ApiUtils.createGetRequestOptions())
                .then(response => response.text())
                .then((result: string) => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },


    deleteExpense(id: string) {
        return new Promise<any>((resolve, reject) => {
            fetch(LicenseGlobals.baseUrl + "/api/Expenses?Id=" + id, ApiUtils.createDeleteRequestOptions())
                .then(response => response.text())
                .then(result => resolve(Boolean(result)))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },

    formRecognition(newImage: FormRecognition) {
        return new Promise<any>((resolve, reject) => {
            console.log('formRecognition');
            console.log(LicenseGlobals.baseUrl)
            fetch(LicenseGlobals.baseUrl + "/api/FormRecognition", ApiUtils.createPostRequestOptions(newImage))
                .then(response => {
                    console.log(response)
                    return response.json();
                })
                .then(result => resolve(result))
                .catch(error => {
                    console.error('error', error);
                    reject(error);
                });
        })
    },
}

export default useApi;
