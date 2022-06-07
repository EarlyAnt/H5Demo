!function () {
    let $ = {};
    window.$ = $;

    function init() {
        console.log("js脚本入口");

        $.mid = "MEDDY936193133884029188";

        loadJSQue([
            // 第三方库：远端库
            "https://cdn.staticfile.org/qiniu-js/3.4.0/qiniu.min.js",
            "https://pixijs.download/release/pixi.js",

            // 第三方库：本地库
            // "./js/libs/gsap.min.js",
            // "./js/libs/pixi.min.js",
            // "./js/libs/pixi-spine.js",
            // "./js/libs/pixi.textinput.min.js",
            // "./js/libs/weui.min.js",
            //replace start
            "./js/server.js",
            //replace end
        ], (p) => {
            // setMainLoading(p*50);
        });

        let btnUpload = document.getElementById("btnCallApi");
        btnUpload.style.display = '';
        btnUpload.removeEventListener("click", showLabel);
        btnUpload.addEventListener("click", showLabel);
    }

    async function loadJSQue(arr, cb) {
        for (let i = 0; i < arr.length; i++) {
            const res = await loadJS(arr[i]);
            if (cb) cb((i + 1) / arr.length);
        }
    }

    function loadJS(src, cb) {
        return new Promise(async (resolve, reject) => {
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement("script");
            script.type = 'text/javascript';

            script.onload = () => {
                if (cb) cb(src);
                else resolve(src);
            }
            script.src = src;
            head.appendChild(script);
        });
    }
    $.loadJS = loadJS;

    async function showLabel() {
        console.log("showLabel->meddyId: " + $.mid);
        let resultBefore = await SERVER.callApi({
            path: "api/upload/before",
            headers: {
                mid: $.mid
            },
            data: {
                gender: "1",
                filename: "file.name"
            }
        })
        console.log(resultBefore);
        if (resultBefore.code == 20000) {
            $.label_sn = resultBefore.data.label_sn;
        } else {
            console.log("showLabel->label_type: " + resultBefore.data.label_type);
        }

        console.log("showLabel->label_sn: " + $.label_sn);
        let resultAfter = await SERVER.callApi({
            path: "api/upload/after",
            headers: {
                mid: $.mid
            },
            data: {
                label_sn: $.label_sn
            }
        })
        console.log(resultAfter);

        lblResult = document.getElementById("lblResult");
        if (resultAfter.data.label_type == 100 || resultAfter.data.label_type == 200 || resultAfter.data.label_type == 300) {
            lblResult.innerText = "空气签: type[" + resultAfter.data.label_type + "] no[" + resultAfter.data.no + "]";
        } else {
            lblResult.innerText = "上上签: type[" + resultAfter.data.label_type + "] no[" + resultAfter.data.no + "]";
        }
    }
    $.showLabel = showLabel;

    window.onload = init();
}();
