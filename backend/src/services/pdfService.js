const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Settings = require('../models/settingsModel');

const generateOrderPDF = async (order, items, filePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            const settingsList = await Settings.getAll();
            const settings = {};
            settingsList.forEach(s => settings[s.key] = s.value);

            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // LOGO & HEADER
            if (settings.logo_url && fs.existsSync(path.join(__dirname, '../../public', settings.logo_url))) {
                doc.image(path.join(__dirname, '../../public', settings.logo_url), 50, 45, { width: 50 });
                doc.fontSize(20).text(settings.business_name || 'DUKA', 110, 50, { bold: true });
            } else {
                doc.fontSize(24).fillColor('#1e40af').text(settings.business_name || 'DUKA', 50, 50, { bold: true });
            }

            doc.fontSize(10).fillColor('#64748b').text('Online Shopping Simplified', 50, 80);
            doc.moveDown();

            // INVOICE LABEL
            doc.fontSize(18).fillColor('#1e293b').text('ORDER INVOICE', { align: 'right' });
            doc.fontSize(10).text(`#${order.order_number || order.id}`, { align: 'right' });
            doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, { align: 'right' });
            doc.moveDown();

            doc.moveTo(50, 130).lineTo(550, 130).stroke('#e2e8f0');
            doc.moveDown();

            // CUSTOMER & DELIVERY INFO
            const infoY = 150;
            doc.fontSize(12).fillColor('#1e293b').text('BILLED TO:', 50, infoY, { bold: true });
            doc.fontSize(10).fillColor('#334155')
                .text(order.customer_name || 'Valued Customer', 50, infoY + 20)
                .text(order.customer_phone || '', 50, infoY + 35)
                .text(order.customer_email || '', 50, infoY + 50);

            doc.fontSize(12).fillColor('#1e293b').text('DELIVERY DETAILS:', 300, infoY, { bold: true });
            doc.fontSize(10).fillColor('#334155')
                .text(`Method: ${order.delivery_type}`, 300, infoY + 20)
                .text(`Location: ${order.delivery_location || 'N/A'}`, 300, infoY + 35);

            if (order.order_notes) {
                doc.moveDown(2);
                doc.fontSize(10).fillColor('#1e293b').text('Notes:', { bold: true });
                doc.fontSize(9).fillColor('#64748b').text(order.order_notes);
            }

            doc.moveDown(2);

            // TABLE HEADER
            const tableTop = doc.y + 20;
            doc.rect(50, tableTop, 500, 20).fill('#f8fafc');
            doc.fillColor('#475569').fontSize(10).text('Product', 60, tableTop + 5);
            doc.text('Qty', 350, tableTop + 5);
            doc.text('Price', 400, tableTop + 5);
            doc.text('Subtotal', 480, tableTop + 5);

            let rowY = tableTop + 25;
            items.forEach((item) => {
                doc.fillColor('#1e293b').fontSize(10).text(item.name, 60, rowY);

                if (item.selected_attributes) {
                    const attrs = typeof item.selected_attributes === 'string' ? JSON.parse(item.selected_attributes) : item.selected_attributes;
                    const attrText = Object.entries(attrs).map(([k, v]) => `${k}: ${v}`).join(', ');
                    doc.fontSize(8).fillColor('#64748b').text(attrText, 60, rowY + 12);
                }

                doc.fillColor('#1e293b').fontSize(10).text(item.quantity.toString(), 350, rowY);
                doc.text(Number(item.price).toLocaleString(), 400, rowY);
                doc.text((item.price * item.quantity).toLocaleString(), 480, rowY);

                rowY += 35;
                doc.moveTo(50, rowY - 5).lineTo(550, rowY - 5).stroke('#f1f5f9');
            });

            // TOTALS
            doc.moveDown();
            const finalY = doc.y + 20;
            doc.fontSize(12).fillColor('#1e293b').text('GRAND TOTAL:', 350, finalY, { bold: true });
            doc.fontSize(14).fillColor('#1e40af').text(`${settings.currency || 'TZS'} ${Number(order.total_price).toLocaleString()}`, 450, finalY, { bold: true });

            // FOOTER
            doc.fontSize(10).fillColor('#94a3b8').text(settings.pdf_footer || 'Thank you for shopping with us!', 50, 750, { align: 'center' });

            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { generateOrderPDF };
