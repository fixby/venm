const config = require("../../config.json");
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

Util.firstLetterUpper = (s) => {
    return s.toLowerCase().split(/\s+/).map(function(item, index) {
        return item.slice(0, 1).toUpperCase() + item.slice(1);
    }).join(' ');
}
Util.pageSize = config.pagecount | 20;
module.exports = Util;