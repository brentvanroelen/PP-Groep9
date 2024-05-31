import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { spawn } from 'child_process';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { MailerSend, EmailParams, Recipient, Sender } from 'mailersend';
dotenv.config();


const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
console.log('Server is running');
const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY,
});
const sentFrom = new Sender(process.env.SENDER, "Jessy Gencel");

app.post('/mail', async(req, res) => {
  const receivedData = req.body;
  console.log(receivedData);
  const recipients = [
  new Recipient(receivedData.To, "Jessy Gencel"),
  ];
  const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setReplyTo(sentFrom)
  .setSubject(receivedData.Subject)
  .setHtml(`<p>${receivedData.Message}</p>`)
  .setText(`<p>${receivedData.Message}</p>`);
  try {
    await mailerSend.email.send(emailParams);
    console.log("Email sent successfully!");
  }catch (error) {
    console.error("Error sending email:", error);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

