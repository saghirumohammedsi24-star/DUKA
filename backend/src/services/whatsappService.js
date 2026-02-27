const Settings = require('../models/settingsModel');

const generateWhatsAppLink = async (order) => {
    try {
        const settingsList = await Settings.getByCategory('WhatsApp');
        const waNumber = settingsList.find(s => s.key === 'whatsapp_number')?.value || '';

        const message = `Habari, nimeweka order namba ${order.order_number || order.id}.
Jina: ${order.customer_name}
Jumla: ${Number(order.total_price).toLocaleString()} TZS
Naomba kushughulikiwa.`;

        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${waNumber.replace('+', '')}?text=${encodedMessage}`;
    } catch (err) {
        console.error('WA Link Error:', err);
        return '';
    }
};

module.exports = { generateWhatsAppLink };
