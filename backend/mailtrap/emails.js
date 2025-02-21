import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [
    {
      email,
    },
  ];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Email Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Email sent Successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [
    {
      email,
    },
  ];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "2e0dc618-d381-464a-bad2-a5dc6bf58e5c",
      template_variables: {
        company_info_name: "Comb scissors ",
        name: name,
        company_info_address: "Test_Company_info_address",
        company_info_city: "Riyadh",
        company_info_zip_code: "77850",
        company_info_country: "Kingdom Saudi Arabia",
      },
    });
    console.log("Welcome Email sent Successfully", response);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

export const sendForgotPasswordEmail = async (email, resetUrl) => {
  const recipient = [
    {
      email,
    },
  ];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Reset Password",
    });
  } catch (error) {
    console.error("Error sending reset password email", error);
    throw new Error(`Error sending reset password email: ${error.message}`);
  }
};
export const sendPasswordResetEmail = async (email, resetToken) => {
  const recipient = [
    {
      email,
    },
  ];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
    console.log("Reset Password Email sent Successfully", response);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};
