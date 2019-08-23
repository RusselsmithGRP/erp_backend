exports.generateReqNo = (prefix, dept, id)=>{
        const idsubstr = id.substring(id.length - 6);
        return (prefix+"/"+dept+"/"+idsubstr);
}

exports.generateLink = (link, id)=>{
        return process.env.PUBLIC_URL+link+id;
} 