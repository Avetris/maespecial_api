function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
}
  
function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}

function emptyOrUnique(rows) {
    if (!rows) {
        return null;
    }
    return rows[0];
}
  
module.exports = {
    getOffset,
    emptyOrRows,
    emptyOrUnique
}