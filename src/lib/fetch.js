const authData = {
    headers: {
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json'
    }
};

if (sessionStorage.hasOwnProperty('token')) {
    authData.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`;
}

export function get (url, opts_) {
    const opts = Object.assign(authData, opts_);
    return fetch(`https://localhost:3000/${url}`, opts)
        .then(res => res.json());
};

export function post (url, data, opts_) {
    const opts = Object.assign(authData, {
        method: 'POST',
        body  : JSON.stringify(data)
    }, opts_);

    return fetch(`https://localhost:3000/${url}`, opts)
        .then(res => res.json());
};

export function put (url, data, opts_) {
    const opts = Object.assign(authData, {
        method: 'PUT'
    }, opts_);
    return fetch(`https://localhost:3000/${url}`, opts)
        .then(res => res.json());
};
