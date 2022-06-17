function getOffset(currentPage = 1, listPerPage)
{
    return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows)
{
    if (!rows) {
        return [];
    }
    return rows;
}

function emptyOrUnique(rows)
{
    if (!rows) {
        return null;
    }
    return rows[0];
}

function groupRows(rows, array_name, attributes)
{
    rows = emptyOrRows(rows);
    rows = rows.reduce((array, item) =>
    {
        if (!array[item.id]) {
            array[item.id] = item;
            array[item.id][array_name] = [];
        }
        if (item[attributes[0]] != null) {
            array_item = {};
            for (let i = 0; i < attributes.length; i++) {
                array_item[attributes[i]] = item[attributes[i]];
                if (array[item.id][array_name].length == 0) delete array[item.id][attributes[i]];
            }
            array[item.id][array_name].push(array_item);

        }
        return array;
    }, Object.create(null));

    return Object.values(rows);
}

module.exports = {
    getOffset,
    emptyOrRows,
    emptyOrUnique,
    groupRows
}