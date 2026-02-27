const nodemailer = require('nodemailer');
const Settings = require('../models/settingsModel');

const sendOrderEmail = async (order, pdfPath) => {
    try {
        const settingsList = await Settings.getByCategory('Email');
        const settings = {};
        settingsList.forEach(s => settings[s.key] = s.value);

        if (!settings.admin_email) {
            console.warn('Admin email not set, skipping notification');
            return;
        }

        const transporter = nodemailer.createTransport({
            host: settings.smtp_host,
            port: parseInt(settings.smtp_port) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // These should be in .env for security
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"DUKA System" <${process.env.EMAIL_USER}>`,
            to: settings.admin_email,
            subject: `🛒 New Order Received – Order #${order.order_number || order.id}`,
            text: `New order from ${order.customer_name}.\nTotal: ${order.total_price}\nDelivery: ${order.delivery_type}`,
            attachments: [
                {
                    filename: `Order_${order.order_number || order.id}.pdf`,
                    path: pdfPath
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
        return info;
    } catch (err) {
        console.error('Email error:', err);
    }
};

module.exports = { sendOrderEmail };
