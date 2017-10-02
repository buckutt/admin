const headers = {
    headers: {
        Accept        : 'application/json',
        'Content-Type': 'application/json'
    }
};

/**
 * Get an image from the image API
 * @param  {String} id   The id of the image
 * @return {Promise} The result as JSON
 */
export function getImage(id) {
    const opts = Object.assign({}, headers, {
        method: 'GET'
    });

    return fetch(`${config.images}/image/${id}?width=100&height=100`, opts)
        .then((res) => {
            if (res.status !== 200) {
                return Promise.reject(res);
            }

            return res.json();
        });
}

/**
 * Post an image to the imageAPI
 * @param  {String} id   The id of the image
 * @param  {String} image  The base64 image
 * @return {Promise} The result as JSON
 */
export function postImage(id, image) {
    const opts = Object.assign({}, headers, {
        method: 'POST',
        body  : JSON.stringify({ image })
    });

    return fetch(`${config.images}/image/${id}`, opts)
        .then((res) => {
            if (res.status !== 200) {
                return Promise.reject(res);
            }

            return res.json();
        });
}
