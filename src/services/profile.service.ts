import {
  ProfileUpdateDTOType,
  ProfileUpdateEmailDTOType,
} from "../dtos/profile/update-profile";
import { throwError } from "../helpers/error-thrower";
import { auth, checkSession } from "../lib/auth";

export class ProfileService {
  static serviceName = "Profile Service";

  static async updateProfileName(
    body: ProfileUpdateDTOType,
    headers?: HeadersInit
  ) {
    try {
      const { name, image } = body;

      const res = await auth.api.updateUser({
        body: { name: name, image: image || undefined },
        asResponse: true,
        headers: headers,
      });

      return res.body;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }

  static async updateProfileEmail(
    body: ProfileUpdateEmailDTOType,
    headers?: HeadersInit
  ) {
    try {
      const { newEmail } = body;

      console.log(newEmail);
      const res = await auth.api.changeEmail({
        body: { newEmail: newEmail, callbackURL: "" },
        asResponse: true,
        headers: headers,
      });
      console.log(res);

      return res.body;
    } catch (error: Error | any) {
      console.error(error);
      throwError(error, this.serviceName);
    }
  }

  static async getProfile(
    headers: Record<string, string | string[] | undefined>
  ) {
    try {
      const session = await checkSession(headers);

      return session?.user || null;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }

  static async resendVerificationEmail(email: string) {
    try {
      const res = await auth.api.sendVerificationEmail({
        body: { email },
        asResponse: true,
      });

      return res.body;
    } catch (error: Error | any) {
      console.error(error);
      throwError(error, this.serviceName);
    }
  }
}
