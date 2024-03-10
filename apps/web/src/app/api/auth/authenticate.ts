import jwt from "jsonwebtoken";
import * as github from "@/api/github";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { githubProfiles, userStatuses, users } from "@/db/schema";

type AuthWithGithubCodeResponse =
  | { token: string; isSuccess: true }
  | { error: string; isSuccess: false };

const signJwt = (userId: number, githubAuthToken: string) => {
  const authResponse = { userId, githubAuthToken };
  return jwt.sign(authResponse, process.env.JWT_SECRET!);
};

export async function authWithGithubCode(
  code: string
): Promise<AuthWithGithubCodeResponse> {
  try {
    const accessToken = await github.getTokenFromCode(code);
    const githubUser = await github.getUser(accessToken);

    const existingUser = await db().query.users.findFirst({
      where: eq(users.authId, githubUser.id.toString()),
    });
    if (existingUser) {
      const token = signJwt(existingUser.id, accessToken);
      return { token, isSuccess: true };
    }

    const email = await github.getEmail(accessToken);

    if (!email) {
      return { error: "No primary email found", isSuccess: false };
    }

    const user = (
      await db()
        .insert(users)
        .values({
          authId: githubUser.id.toString(),
          email: email,
          name: githubUser.login,
          userName: githubUser.login,
        })
        .returning({ id: users.id })
    ).at(0);

    if (!user) return { error: "Failed to create user", isSuccess: false };

    await db().insert(githubProfiles).values({
      githubUserId: githubUser.id.toString(),
      userId: user.id,
      reposUrl: githubUser.repos_url,
      login: githubUser.login,
    });

    await db().insert(userStatuses).values({
      userId: user.id,
    });

    const token = signJwt(user.id, accessToken);
    return { token, isSuccess: true };
  } catch (error) {
    console.error(error);
    return {
      error: "Unexpected error when trying to authenticate with Github",
      isSuccess: false,
    };
  }
}
