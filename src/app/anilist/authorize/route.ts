import { redirect } from "next/navigation";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    // TODO Handle errors and no code
    console.log(code);

    // TODO Run code from api/anilist/authorize, refactor to shared lib

    // TODO Redirect to latest

    // TODO Remove manual auth
    redirect("/");
}
