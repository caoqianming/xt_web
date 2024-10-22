import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
/**
 *
 * @param {*} reportName 下载时候的标题
 * @param {*} isDownload  是否下载默认为下载，传false不下载
 */
const getPdf = function (reportName, isDownload = true) {
	return new Promise((resolve, reject) => {
		var title = reportName;
		html2Canvas(document.querySelector("#pdfDom"), {
			allowTaint: true,
			useCORS: true,
		}).then((canvas) => {
			const contentWidth = canvas.width;
			const contentHeight = canvas.height;
			console.log("contentWidth", contentWidth);
			console.log("contentHeight", contentHeight);
			//页面偏移
			let position = 5;
			//a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
			const imgWidth = contentWidth - 20;
			const imgHeight = contentHeight - 20;
			let pageData = canvas.toDataURL("image/jpeg", 1.0);
			let PDF = new JsPDF("p", "px", [210, 270]);

			//有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
			//当内容未超过pdf一页显示的范围，无需分页
			PDF.addImage(pageData, "JPEG", 10, 10, imgWidth, imgHeight);
			PDF.save(title + ".pdf");
			if (isDownload) {
				PDF.save(title + ".pdf");
			}
			// 删除本地存储的base64字段
			var pdfData = PDF.output("datauristring"); //获取base64Pdf
			let blobData = new Blob([PDF], {
				type: "application/pdf",
			});
			console.log("blobData", blobData);
			resolve(blobData);
		});
	});
};

export default getPdf;
