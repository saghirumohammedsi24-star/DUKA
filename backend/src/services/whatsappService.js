const Settings = require('../models/settingsModel');
const Order = require('../models/orderModel');

const generateWhatsAppLink = async (order) => {
    try {
        const settingsList = await Settings.getByCategory('WhatsApp');
        const waNumber = settingsList.find(s => s.key === 'whatsapp_number')?.value || '';

        // Fetch items for summary
        const items = await Order.getOrderItems(order.id);
        const itemsSummary = items.map(item => `- ${item.name} (${item.quantity})`).join('\n');

        const message = `🌟 *NEW ORDER #${order.order_number || order.id}* 🌟

Habari, nimeweka order mpya:

👤 *Mteja:* ${order.customer_name}
📦 *Bidhaa:*
${itemsSummary}

🚚 *Delivery:* ${order.delivery_type}
📍 *Location:* ${order.delivery_location || 'N/A'}

💰 *JUMLA:* ${Number(order.total_price).toLocaleString()} TZS

Naomba kushughulikiwa. Asante!`;

        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${waNumber.replace('+', '').replace(/\s/g, '')}?text=${encodedMessage}`;
    } catch (err) {
        console.error('WA Link Error:', err);
        return '';
    }
};

module.exports = { generateWhatsAppLink };
