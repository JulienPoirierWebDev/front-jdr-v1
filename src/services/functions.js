import {useNavigate} from "react-router-dom";
import api_roliste from "./api_roliste";
import requests from "./requests";
import {useEffect, useRef} from "react";

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function validateEmail(email) {
    // test de la structure globale : commence par une lettre, lettre ou chiffre avant le @,
    // deux caractère minimum après le @, deux lettres minimum en dernier.
    let myRegexConditionEmail1 = /^[\w]+[\w\d-_.]*[\w\d]+[@][\w\d-_.]{2,}[.][\w]{2,}$/i;
    // test s'il y a deux points de suite
    let myRegexConditionEmail2 = /\.(?=\.)/;
    // test s'il y a deux underscore de suite
    let myRegexConditionEmail3 = /_(?=_)/;
    // test s'il y a deux tierts de suite
    let myRegexConditionEmail4 = /-(?=-)/;

    let myRegexTestEmail1 = (myRegexConditionEmail1).test(email);
    let myRegexTestEmail2 = (myRegexConditionEmail2).test(email);
    let myRegexTestEmail3 = (myRegexConditionEmail3).test(email);
    let myRegexTestEmail4 = (myRegexConditionEmail4).test(email);

    // Si le 1er text est refusé ou si l'un des trois derniers est accepté, refus de la validité de l'email.
    if (!myRegexTestEmail1 || myRegexTestEmail2 || myRegexTestEmail3 || myRegexTestEmail4) {
        return false;
    } else {
        return true

    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function deleteFromArray(arr, itemValue):void {
    for( let i = 0; i < arr.length; i++){
        if ( arr[i] === itemValue) {
            arr.splice(i, 1);
        }
    }
}

function escapeHtmlV1(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeHtmlV2(text) {
    let map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function setValueInt(stringValue = 0) {
    return parseInt((stringValue))
}

const fetchDataAdventure = async (loaded, setLoaded, adventureId, setData, request, jwt) => {
    if (!loaded){
        let data = {
            'adventure': "api/adventures/" + adventureId
        }
        return (
            await api_roliste.postData(request, data, jwt).then((res) => {
                setData(res.data["hydra:member"]);
                setLoaded(true);
            }).catch(error => { console.log(error)})
        )
    }
}

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function errorAxiosHandling (error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
    console.log(error.config);
};


let functions = {
    capitalizeFirstLetter,
    validateEmail,
    parseJwt,
    deleteFromArray,
    escapeHtmlV2,
    setValueInt,
    fetchDataAdventure,
    useInterval,
    errorAxiosHandling
}


export default functions;