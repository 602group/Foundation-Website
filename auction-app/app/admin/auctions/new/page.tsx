import { db } from  "@/app/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function createAuction(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const buyoutPriceStr = formData.get("buyoutPrice") as string;
    const startingBidStr = formData.get("startingBid") as string;
    const endDateStr = formData.get("endDate") as string;
    const imageUrl = formData.get("imageUrl") as string;

    await db.auction.create({
        data: {
            title,
            description,
            location,
            images: imageUrl ? [imageUrl] : [],
            currentBid: Number(startingBidStr),
            buyoutPrice: buyoutPriceStr ? Number(buyoutPriceStr) : null,
            endDate: new Date(endDateStr),
            status: "ACTIVE",
        },
    });

    revalidatePath("/admin/auctions");
    revalidatePath("/auctions");
    revalidatePath("/");
    redirect("/admin/auctions");
}

export default function NewAuction() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
                <Link href="/admin/auctions" className="text-gray-500 hover:text-black">
                    &larr; Back
                </Link>
                <h1 className="text-3xl font-bold">Create New Auction</h1>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <form action={createAuction} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location (e.g., Pebble Beach, CA)
                        </label>
                        <input
                            type="text"
                            name="location"
                            required
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description / Details
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded-md p-2"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Starting Bid ($)
                            </label>
                            <input
                                type="number"
                                name="startingBid"
                                required
                                min="0"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Buy It Now Price ($) [Optional]
                            </label>
                            <input
                                type="number"
                                name="buyoutPrice"
                                min="0"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                required
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image URL
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                placeholder="https://..."
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition"
                        >
                            Create Auction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
