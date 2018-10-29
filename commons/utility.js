exports.generateReqNo = (prefix, dept, id, callback)=>{
        const idsubstr = id.substring(id.length - 6);
        callback(prefix+"/"+dept+"/"+idsubstr);
}
