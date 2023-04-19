package com.portal.core.module.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.portal.core.common.exception.ValidateException;
import com.portal.core.module.entities.Address;
import com.portal.core.module.entities.DetailOrders;
import com.portal.core.module.entities.Orders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.math.BigDecimal;

@Service
public class ExportPdfService {

    private Logger logger = LoggerFactory.getLogger(ExportPdfService.class);

//    @Autowired
//    private TemplateEngine templateEngine;

    @Autowired
	private OrdersService ordersService;

	@Autowired
	private AddressService addressService;

//    public ByteArrayInputStream exportReceiptPdf(String templateName,Long id) throws ValidateException {
//        Map<String, Object> data = new HashMap<>();
//
//        Orders order = ordersService.findByorderId(id);
//
//        data.put("order",order);
//
//        List<BillRespon> billRespons = new ArrayList<>();
//
//        for (DetailOrders detailOrders: order.getListOrderDetail() ) {
//            BillRespon billRespon = new BillRespon();
//            billRespon.setIdProductDetail(detailOrders.getProductDetail().getId());
//            billRespon.setProductName(detailOrders.getProductDetail().getProduct().getName());
//            billRespon.setColorName(detailOrders.getProductDetail().getColor().getName());
//            billRespon.setSizeName(detailOrders.getProductDetail().getSize().getName());
//            billRespon.setQuantity(detailOrders.getQuantity());
//            billRespon.setPrice(detailOrders.getPrice());
//            billRespons.add(billRespon);
//        }
//        data.put("billRespons",billRespons);
//
//        Context context = new Context();
//        context.setVariables(data);
//        String htmlContent = templateEngine.process(templateName, context);
//
//        ByteArrayInputStream byteArrayInputStream = null;
//        try {
//            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//            ITextRenderer renderer = new ITextRenderer();
//            renderer.setDocumentFromString(htmlContent);
//            renderer.layout();
//            renderer.createPDF(byteArrayOutputStream, false);
//            renderer.finishPDF();
//            byteArrayInputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
//        } catch (DocumentException e) {
//            logger.error(e.getMessage(), e);
//        }
//
//        return byteArrayInputStream;
//    }

    public void generate(HttpServletResponse response,Long id ) throws DocumentException, IOException, ValidateException {

        Orders order = ordersService.findByorderId(id);

        Document document = new Document(PageSize.A4);

        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font fonttitle = FontFactory.getFont(FontFactory.TIMES_ROMAN);
//
		fonttitle.setSize(20);

		BaseFont bfComic = BaseFont.createFont("PingFang-SC-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
		Font fonts = new Font(bfComic, 20);

		// Creating paragraph
		Paragraph paragraph = new Paragraph("Hóa đơn mua hàng", fonts);

		// Aligning the paragraph in document
		paragraph.setAlignment(Paragraph.ALIGN_CENTER);

		// Creating paragraph
		Paragraph paragraph1 = new Paragraph("Thông tin đặt hàng: ");
		paragraph1.setAlignment(Paragraph.ALIGN_LEFT);

		Address address = addressService.findById(order.getAddress().getId());

		Paragraph paragraph2 = new Paragraph("Họ và tên: "+ address.getFullName());
		paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

		Paragraph paragraph3 = new Paragraph("Số điện thoại: "+address.getPhoneNumber());
		paragraph3.setAlignment(Paragraph.ALIGN_LEFT);

		Paragraph paragraph4 = new Paragraph("Địa chỉ nhận hàng: "+ address.getAddressFull());
		paragraph4.setAlignment(Paragraph.ALIGN_LEFT);

		Paragraph paragraph5 = new Paragraph("Ngày mua hàng: "+order.getCreateDate());
		paragraph5.setAlignment(Paragraph.ALIGN_LEFT);


		document.add(paragraph);
		document.add(paragraph2);
		document.add(paragraph3);
		document.add(paragraph4);
		document.add(paragraph5);

		// Creating a table of 3 columns
		PdfPTable table = new PdfPTable(8);

		// Setting width of table, its columns and spacing
		table.setWidthPercentage(100f);
		table.setWidths(new int[]{2, 3, 3, 3, 3, 3, 3, 3});
		table.setSpacingBefore(5);

		// Create Table Cells for table header
		PdfPCell cell = new PdfPCell();

		// Setting the background color and padding
		Color cyan      = new Color(66,	110	,180);
		cell.setBackgroundColor(cyan);
		cell.setPadding(5);

		// Creating font
		// Setting font style and size
		Font font2 = new Font(bfComic, 30);

		// Adding headings in the created table cell/ header
		// Adding Cell to table
		cell.setPhrase(new Phrase("TT"));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Mã Sản Phẩm"));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Tên Sản Phẩm"));
		table.addCell(cell);
		cell.setPhrase(new Phrase("kích Thước"));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Màu Sắc"));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Số Lượng"));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Giá"));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Thành Tiền"));
		table.addCell(cell);

		int index = 0;
		for (DetailOrders detailOrders: order.getListOrderDetail() ) {
			BigDecimal intoMoney =  detailOrders.getTotalPrice().multiply(BigDecimal.valueOf(detailOrders.getQuantity()));
			table.addCell((index +1)+"");
			index++;
			table.addCell(detailOrders.getProductDetail().getId().toString());
			table.addCell(detailOrders.getProductDetail().getProduct().getName());
			table.addCell(detailOrders.getProductDetail().getSize().getName());
			table.addCell(detailOrders.getProductDetail().getColor().getName());
			table.addCell(detailOrders.getQuantity().toString());
			table.addCell(detailOrders.getTotalPrice().toString());
			table.addCell(intoMoney.toString());
		}
		// Adding the created table to document
		document.add(table);

		// Closing the document
		document.close();
		}
    }


