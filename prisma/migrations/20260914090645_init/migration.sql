-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageKeywords" TEXT[],

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
