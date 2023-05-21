const xlsx = require('xlsx');
module.exports = (jsonData) => {
    const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(jsonData);
xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
}
