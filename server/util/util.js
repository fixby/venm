const Util = {};
Util.status = (code, msg, data) => {
    return {
        status: {
            code: code,
            msg: msg,
        },
        data: data,
    }
}
Util.pageSize = 5;
module.exports = Util;