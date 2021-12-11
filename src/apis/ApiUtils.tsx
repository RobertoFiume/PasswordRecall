import LicenseGlobals from "@infominds/react-native-license";

export default {
    createGetRequestOptions() {
        return {
            method: 'GET',
            headers: createHeader()
        };
    },
    createDeleteRequestOptions() {
        return {
            method: 'DELETE',
            headers: createHeader()
        };
    },
    createPostRequestOptions(data: any) {
        return {
            method: 'POST',
            headers: createHeader(),
            body: JSON.stringify(data)
        };
    },
    createPutRequestOptions(data: any) {
        return {
            method: 'PUT',
            headers: createHeader(),
            body: JSON.stringify(data)
        };
    },
    createHeader() {
        return createHeader();
    }
}

function createHeader() {
    var myHeaders = new Headers();

    myHeaders.append("Authorization", LicenseGlobals.token);

    if (LicenseGlobals.mandantId) {
        myHeaders.append("mandantID", LicenseGlobals.mandantId.toString());
    }

    myHeaders.append("Content-Type", "application/json");

    return myHeaders;
}
