// TODO test, was to time consuming to implement but would be cleaner
function priceFormat(price: string, currency?: string) {
    let ret = price.toString().replace('.', ',') + ' ' + (currency ?? '€');
    ret = ret.replace(',00', '');
    return ret.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // add . every 3 digits
}
function removeFormat(price: string, currency?: string) {
    return price.replace(' ' + (currency ?? '€'), '').replace(/\./g, '');
}

// these are beeing used
export function addPoints(price: string) {
    return price.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export function removePoints(price: string) {
    return price.replace(/\./g, '');
}


export function formatPriceString(price?: string) {
    // todo add always two comma
    if (price)
        return price.replace(/\./g, ',')
    return '';
}

export function formatPrice(price: number) {
    // console.log('formatPrice', price)
    if (price)
        return price.toFixed(2).replace(/\./g, ',')
    return ''
}