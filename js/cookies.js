import {detectionDevice} from './functions';

export const setCookies = (name, value, days) => {
    if(detectionDevice()){
        localStorage.setItem(name, value);
    } else {
        let expires;
        if (days) {
            const data = new Date();
            data.setTime(data.getTime()+(days*24*60*60*1000));
            //data.setTime(data.getTime()+(2*60*1000));     // na dwie minuty
            expires = "; expires="+data.toGMTString();
        } else {
            expires = "";
        }

        document.cookie = name+"=" + value + expires + "; path=/";
    }
};

export const removeCookies = (name) => {
    if(detectionDevice()){
        localStorage.removeItem(name);
    } else {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
};

export const getCookies = (name,array) => {
    if(detectionDevice()) {
        if(array) {
            return JSON.parse(localStorage.getItem(name));
        } else {
            return localStorage.getItem(name);
        }
    } else {
        if (document.cookie !== "") {
            const cookies=document.cookie.split(/; */);
            for (let i=0; i<cookies.length; i++) {
                const nameCookie=cookies[i].split("=")[0];
                const valueCookie=cookies[i].split("=")[1];
                if (nameCookie===decodeURIComponent(name)) {
                    return decodeURIComponent(valueCookie);
                }
            }
        }
    }
};
