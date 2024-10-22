import * as XLSX from 'xlsx';
/**
 * eg: .columns = [
 *    { header: 'Id', key: 'id', wpx: 10 },
 *    { header: 'Name', key: 'name', wch: 32 },
 *    { header: 'D.O.B.', key: 'dob', width: 10, hidden: true }
 * ]
 * data: [{id: 1, name: 'John Doe', dob: new Date(1970,1,1)}]
 * @param columns 定义列属性数组
 * @param data  数据
 * @param name  文件名
 */
export const generateExcel = (columns = [], data = [], name = '') => {
  const headers = columns.map((item) => item.header);
  const otherConfigs = columns.map(({ key, header, ...item }) => item);
  const dataList = data.map((item) => {
    let obj = {};
    columns.forEach((col) => {
      obj[col.header] = item[col.key];
    });
    return obj;
  });
  const workbook = XLSX.utils.book_new();
  workbook.SheetNames.push(name);
  const worksheet = XLSX.utils.json_to_sheet(dataList, {
    header: headers,
  });
  worksheet['!cols'] = otherConfigs;
  workbook.Sheets[name] = worksheet;
  // 生成Blob数据
  const excelData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  const blobData = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  // 创建Blob URL
  const blobUrl = URL.createObjectURL(blobData);
  // 创建一个隐藏的<a>标签并设置href属性为Blob URL
  const link = document.createElement('a');
  link.href = blobUrl;
  link.target = '_blank';
  link.download = `${name}.xlsx`;
  // 触发点击操作，开始下载文件
  link.click();
  // 释放Blob URL
  URL.revokeObjectURL(blobUrl);
};