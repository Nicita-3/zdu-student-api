import fetch from 'cross-fetch';
import iconv from "iconv-lite";
import { SessionData } from "./types";

/**
 * Отримати sesID та sessGUID користувача
 * @category Cabinet
 * @param family - прізвище користувача
 * @param password - пароль
 * @returns Об'єкт { sesID, sessGUID }
 */
export async function getSesId(family: string, password: string): Promise<SessionData> {
  try {
    const formData = `user_name=${family}&user_pwd=${password}&n=1&rout=&t=16161`;
    const encodedFormData = iconv.encode(formData, "windows-1251");
    const response = await fetch(
      "https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=1&ts=16161",
      {
        method: "POST",
        body: new Uint8Array(encodedFormData),
        redirect: "manual",
      }
    );

    if (response.status === 302) {
      const buffer = await response.arrayBuffer();
      const responseText = iconv.decode(Buffer.from(buffer), "utf-8");
      const cookies = response.headers.get("set-cookie");
      let sessGUID = "";
      if (cookies) {
        const sessGUIDStart = cookies.indexOf("SessGUID=") + "SessGUID=".length;
        const sessGUIDEnd = cookies.indexOf(";", sessGUIDStart);
        sessGUID = cookies.substring(sessGUIDStart, sessGUIDEnd);
      }
      const sesIDIndex = responseText.indexOf("sesID=") + 6;
      const sesID = responseText.substring(sesIDIndex, sesIDIndex + 36);

      return { ok: true, sesID, sessGUID };
    }

    return { ok: false, sesID: '', sessGUID: '' };
  } catch (e) {
    console.error("Error in getSesID:", e);
    throw e;
  }
}
