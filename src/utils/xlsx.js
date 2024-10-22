import * as XLSX from "xlsx";

const ExportExcel = function(domId, name) {
    const table = document.querySelector(domId);
    const workbook = XLSX.utils.table_to_book(table);

    XLSX.writeFile(workbook, `${name}.xlsx`);
}
export default (app) => {
    app.config.globalProperties.$XLSX = ExportExcel;
}