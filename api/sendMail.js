import nodemailer from 'nodemailer';
import {formatPrice} from "../src/utils/formatPrice.js";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { name, email, cart, total, whatsapp } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const itemsHtml = cart.map(item =>
        `<li>${item.quantity} x ${item.product.name} - $${item.product.price}</li>`
    ).join('');

    const ownerMailOptions = {
        from: `"Aeternum" <${process.env.EMAIL_USER}>`,
        to: 'aeternumaccesoriosventas@gmail.com',
        subject: `Nueva venta realizada por ${name}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; background: #fdf9f3; color: #333;">
                <h2>🛍️ ¡Nueva venta!</h2>
                <p><strong>Cliente:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>WhatsApp:</strong> ${whatsapp}</p>
                <p><strong>Total:</strong> ${formatPrice(total)}</p>
                <p><strong>Carrito:</strong></p>
                <ul>${itemsHtml}</ul>
                <p>Podés contactarlo para coordinar el envío o confirmar el pago.</p>
            </div>
        `,
    };

    const customerMailOptions = {
        from: `"Aeternum" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "¡Gracias por tu compra, " + name + "!",
        html: `
          <div style="font-family: 'Georgia', serif; background-color: #f9f4ef; color: #3c2f2f; padding: 24px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
              <div style="background-color: #a5732d; padding: 24px; text-align: center;">
                <img src="https://www.aeternum-accesorios.com.ar/logo.jpeg" alt="Aethernum Logo" style="height: 80px; margin-bottom: 16px;" />
                <h1 style="color: white; font-size: 28px; margin: 0;">Gracias por tu compra</h1>
              </div>
        
              <div style="padding: 24px;">
                <p style="font-size: 18px;">Hola <strong>${name}</strong>,</p>
                <p>¡Gracias por elegir Aeternum! Te compartimos el resumen de tu pedido:</p>
                
                <div style="margin: 24px 0;">
                  <ul style="padding-left: 20px; font-size: 16px; line-height: 1.6; color: #5e4a4a;">
                    ${itemsHtml}
                  </ul>
                </div>
        
                <p style="font-size: 18px;"><strong>Total:</strong> ${formatPrice(total)}</p>
        
                <p style="margin-top: 24px;">En breve nos pondremos en contacto para coordinar el envío 📦.</p>
                <p style="margin-top: 24px;">Gracias por confiar en nosotros,</p>
                <p><em>El equipo de Aeternum</em></p>
              </div>
        
              <div style="background-color: #f2e6da; text-align: center; padding: 16px; font-size: 14px; color: #93765d;">
                <p>Síguenos en Instagram @aeternum.accesorios</p>
              </div>
            </div>
          </div>
          `,
        };

    try {
        await transporter.sendMail(customerMailOptions);
        await transporter.sendMail(ownerMailOptions);
        res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el correo' });
    }
}
