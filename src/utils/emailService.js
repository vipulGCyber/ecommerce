// Placeholder email service
const sendEmail = async (to, subject, html) => {
  // TODO: Implement actual email sending using nodemailer or similar
  console.log(`Email sent to: ${to}`);
  console.log(`Subject: ${subject}`);
  return { success: true, message: 'Email sent successfully' };
};

const sendOrderConfirmation = async (user, order) => {
  const subject = `Order Confirmation - ${order.orderNumber}`;
  const html = `
    <h2>Order Confirmation</h2>
    <p>Dear ${user.firstName},</p>
    <p>Your order has been confirmed!</p>
    <p>Order Number: ${order.orderNumber}</p>
    <p>Total Amount: $${order.total}</p>
  `;

  return sendEmail(user.email, subject, html);
};

const sendOrderShipped = async (user, order) => {
  const subject = `Your Order Has Been Shipped - ${order.orderNumber}`;
  const html = `
    <h2>Order Shipped</h2>
    <p>Dear ${user.firstName},</p>
    <p>Your order has been shipped!</p>
    <p>Order Number: ${order.orderNumber}</p>
    <p>Tracking Number: ${order.trackingNumber}</p>
  `;

  return sendEmail(user.email, subject, html);
};

const sendPasswordResetEmail = async (email, resetLink) => {
  const subject = 'Password Reset Request';
  const html = `
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
  `;

  return sendEmail(email, subject, html);
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendOrderShipped,
  sendPasswordResetEmail,
};
