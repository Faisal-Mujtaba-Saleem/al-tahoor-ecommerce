// Third-party libraries
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  totalPrice: number;
  products: Product[];
}

export async function sendOrderEmails(data: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  const productListHtml = data.products
    .map(
      (item) =>
        `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`
    )
    .join("");

  const commonStyles = `
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
  `;

  // Customer Email
  const customerMailOptions = {
    from: `"Al-Tahoor Healthcare" <${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: `
      <div style="${commonStyles}">
        <h2 style="color: #1a1a1a;">Thank you for your order, ${data.customerName}!</h2>
        <p>We have received your order <strong>#${data.orderNumber}</strong> and it is being processed.</p>
        
        <h3>Order Summary:</h3>
        <ul>${productListHtml}</ul>
        <p><strong>Total Price: $${data.totalPrice.toFixed(2)}</strong></p>
        
        <h3>Shipping Details:</h3>
        <p>
          ${data.address}<br>
          ${data.city}<br>
          Phone: ${data.phone}
        </p>
        
        <p>We will contact you soon for payment and delivery details.</p>
        <p>Best Regards,<br>Al-Tahoor Healthcare Team</p>
      </div>
    `,
  };

  // Admin Email
  const adminMailOptions = {
    from: `"Store Notification" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `New Order Received - ${data.orderNumber}`,
    html: `
      <div style="${commonStyles}">
        <h2 style="color: #d32f2f;">New Order Received!</h2>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Customer:</strong> ${data.customerName} (${data.email})</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        
        <h3>Products:</h3>
        <ul>${productListHtml}</ul>
        <p><strong>Total Revenue: $${data.totalPrice.toFixed(2)}</strong></p>
        
        <h3>Shipping Address:</h3>
        <p>
          ${data.address}<br>
          ${data.city}
        </p>
        
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin/orders" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">View Order in Dashboard</a></p>
      </div>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);
    console.log("Order emails sent successfully");
  } catch (error) {
    console.error("Error sending order emails:", error);
  }
}

interface ContactData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactFormEmail(data: ContactData) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const commonStyles = `
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
  `;

  const mailOptions = {
    from: `"Contact Form" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    replyTo: data.email,
    subject: `New Contact Message from ${data.name}`,
    html: `
      <div style="${commonStyles}">
        <h2 style="color: #007bff;">New Contact Message</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        
        <h3>Message:</h3>
        <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff;">
          ${data.message.replace(/\n/g, '<br>')}
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Contact email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { success: false, error };
  }
}
