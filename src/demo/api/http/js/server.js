!function () {
    var SERVER = {}

    function getServerURL(){
        //replace server
        return 'https://mcd-api.gululu.com/';
        //replace server
    }

    //封装统一请求
    async function request(params) {
        const url = params.url;
        const method = params.method || 'GET';

        let headers = {
            "Content-Type": "application/json"
        };
        if (params.headers) {
            for (let item in params.headers) {
                headers[item] = params.headers[item];
            }
        }

        let data = {};
        if (params.data) {
            for (let item in params.data) {
                data[item] = params.data[item];
            }
        }

        let body;

        if (headers['Content-Type'] == 'application/json') {
            body = JSON.stringify(data);
        } else if (headers['Content-Type'] == 'application/x-www-form-urlencoded') {
            let bodys = [];
            for (let item in data) {
                bodys.push(item + '=' + data[item]);
            }
            body = bodys.join("&");
        }

        console.log("method:" + method);

        if (method.toLowerCase() == 'get') {
            body = null;
        }

        const res = await fetch(url, {
            method: method,
            body: body,
            headers: headers,
        });
        return await res.json();
    }
    $.request = request;

    async function callApi(params) {
        if (!$.request) throw new Error("pls confirm request already mounted");

        // if(!params.headers.mid){
        //     console.log("no meddyid");
        //     return null;
        // }

        const res = await $.request({
            url: getServerURL() + params.path,
            method: params.method || "POST",
            data: params.data || {},
            headers: params.headers || {}
        })

        return res;
    }
    SERVER.callApi = callApi;

    window.SERVER = SERVER;
}();