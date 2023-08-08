import { SignOutButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

async function Page() {
    return (
        <main>
            <h1 className="head-text">Onboardonggggg</h1>
            <UserButton/>
            <SignOutButton>
                        <div className="flex cursor-pointer">
                            <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
                        </div>
            </SignOutButton>
        </main>
    )
}

export default Page;