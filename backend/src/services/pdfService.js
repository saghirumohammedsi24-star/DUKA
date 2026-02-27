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

            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Header - Business Info
            doc.fontSize(20).text(settings.business_name || 'DUKA Online Mall', { underline: true });
            doc.fontSize(10).text(settings.pdf_footer || 'Shukrani kwa kuchagua DUKA!');
            doc.moveDown();

            // Order Info
            doc.fontSize(14).text(`Order Number: ${order.order_number || order.id}`, { bold: true });
            doc.fontSize(12).text(`Date: ${new Date().toLocaleString()}`);
            doc.text(`Customer: ${order.customer_name || 'N/A'}`);
            doc.text(`Phone: ${order.customer_phone || 'N/A'}`);
            doc.text(`Delivery: ${order.delivery_type || 'Pickup'}`);
            if (order.delivery_location) doc.text(`Location: ${order.delivery_location}`);
            doc.moveDown();

            // Items Table
            doc.fontSize(14).text('Items List', { underline: true });
            doc.moveDown(0.5);

            items.forEach((item, index) => {
                const y = doc.y;
                doc.fontSize(11).text(`${index + 1}. ${item.name}`, 50, y);
                doc.fontSize(10).text(`Price: ${item.price} x ${item.quantity}`, 50, y + 15);

                if (item.selected_attributes) {
                    const attrs = typeof item.selected_attributes === 'string' ? JSON.parse(item.selected_attributes) : item.selected_attributes;
                    const attrText = Object.entries(attrs).map(([k, v]) => `${k}: ${v}`).join(', ');
                    doc.fontSize(9).text(`Attributes: ${attrText}`, 50, y + 30);
                    doc.moveDown(2.5);
                } else {
                    doc.moveDown(1.5);
                }
            });

            doc.moveDown();
            doc.fontSize(16).text(`Grand Total: ${settings.currency || 'TZS'} ${Number(order.total_price).toLocaleString()}`, { align: 'right' });

            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { generateOrderPDF };
