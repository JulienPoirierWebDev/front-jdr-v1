import axios from "axios"

const getAllData = async (url, jwt) => {

    let config = {};
    if(jwt) {
        config = {
            headers: {
                "Authorization" : "Bearer "+jwt+" "
            }
        }
    } else {
        config = {
            headers: {
            }
        }
    }

    return await axios.get(url, config).then(function (response) {
        return response;
    }).catch(function (error) {
        return console.log("Erreur getOn " + error)});
}

const getOneData = async (url, data, jwt) => {
    let config = {};
    if(jwt) {
        config = {
            headers: {
                "Authorization" : "Bearer "+jwt+" "
            }
        }
    } else {
        config = {
            headers: {
            }
        }
    }

    let newdata = data.map(x => (x[0] + "=" + x[1]));
    const newUrl = url + "?"+ newdata;

    return await axios.get(newUrl, config).then(function (response) {
        return response;
    }).catch(function (error) {
        return console.log("Erreur getOn " + error)});
}
/*
const getCharacterData = async (url, data, jwt) => {
    let config = {};
    if(jwt) {
        config = {
            headers: {
                "Authorization" : "Bearer "+jwt+" "
            }
        }
    } else {
        config = {
            headers: {
            }
        }
    }

    const newUrl = url + "/"+ data;

    return await axios.get(newUrl, config).then(function (response) {
        return response;
    }).catch(function (error) {
        console.log("Erreur getOn " + error)});
}

const postData = async (url, data) => {
    console.log(data);
    let config = {
        headers: {
            "Content-Type": "application/json",
        }
    }
    let result = await axios.post(url, data, config);
    console.log(result['data']['hydra:member']);
    return result;
}
*/
function postData(url, data, jwt = null) {
    let config = {};
    if(jwt) {
        //console.log(jwt)
        config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer "+jwt+" "
            }
        }
        //console.log(config)
    } else {
        config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
    }
    return axios.post(url, data, config).then(function (response) {
        return response;
    }).catch(function (error) {
        return console.log("Erreur getOn " + error)});
}


const putData =  async (url, data) => {
    return await axios.put(url, data).then((res) => res.data);
}

const patchData = async (url, data, jwt) => {
    let config = {};
    if(jwt) {
        //console.log(jwt)
        config = {
            headers: {
                "Content-Type": "application/merge-patch+json",
                "Authorization" : "Bearer "+jwt+" "
            }
        }
        //console.log(config)
    } else {
        config = {
            headers: {
                "Content-Type": "application/merge-patch+json",
            }
        }
    }
    return await axios.patch(url, data, config)
}

const deleteData =  async (url, jwt) => {
    let config = {};
    if(jwt) {
        console.log(jwt)
        config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer "+jwt
            }
        }
        //console.log(config)
    } else {
        config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
    }
    return await axios.delete(url, config).then((res) => res.data);
}

export default {
    getAllData,
    postData,
    getOneData,
    putData,
    deleteData,
    patchData
}

