import { EventEmitter } from "node:events";
import Mail from "nodemailer/lib/mailer";
import { sendEmail } from "../email/send.email";
import { verifyEmailTemplate } from "../email/verify.email.template";
import { OtpEnum } from "src/common/enums";

interface IEmail extends Mail.Options {
  otp:string
}
export const emailEvent = new EventEmitter();

emailEvent.on(OtpEnum.ConfirmEmail, async (data:IEmail ) => {
  try {
    data.subject = OtpEnum.ConfirmEmail;
    data.html = verifyEmailTemplate({otp:data.otp , title:data.subject})
    await sendEmail(data);
  } catch (error) {
    console.log("fail to send email", error);
  }
});

emailEvent.on(OtpEnum.ResetPassword, async (data:IEmail ) => {
  try {
    data.subject =OtpEnum.ResetPassword;
    data.html = verifyEmailTemplate({otp:data.otp , title:data.subject})
    await sendEmail(data);
  } catch (error) {
    console.log("fail to send email", error);
  }
});
