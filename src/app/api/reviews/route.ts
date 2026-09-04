import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;

    const reviews = db.getReviews(productId);
    let rating = 0;
    let reviewCount = 0;

    if (productId) {
      const stats = db.getProductRating(productId);
      rating = stats.rating;
      reviewCount = stats.reviewCount;
    }

    return NextResponse.json({
      success: true,
      reviews,
      rating,
      reviewCount,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, authorName, rating, comment, imageUrl } = body;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const prod = db.getProductById(productId);
    if (!prod) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    const parsedRating = Number(rating);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5 stars" },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== "string" || comment.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Comment is required" },
        { status: 400 }
      );
    }

    if (comment.trim().length > 1000) {
      return NextResponse.json(
        { success: false, error: "Comment cannot exceed 1000 characters" },
        { status: 400 }
      );
    }

    if (imageUrl && typeof imageUrl === "string" && imageUrl.length > 3 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image size exceeds 2.5MB limit" },
        { status: 400 }
      );
    }

    const author = (typeof authorName === "string" && authorName.trim())
      ? authorName.trim()
      : "ผู้ใช้นิรนาม";

    const newReview = db.createReview({
      productId,
      authorName: author,
      rating: Math.round(parsedRating),
      comment: comment.trim(),
      imageUrl: (imageUrl && typeof imageUrl === "string") ? imageUrl : undefined,
    });

    const updatedStats = db.getProductRating(productId);

    return NextResponse.json({
      success: true,
      review: newReview,
      rating: updatedStats.rating,
      reviewCount: updatedStats.reviewCount,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
