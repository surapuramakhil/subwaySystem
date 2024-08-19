-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "entryStation" TEXT NOT NULL,
    "exitStation" TEXT,
    "fare" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_number_key" ON "Card"("number");

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_cardNumber_fkey" FOREIGN KEY ("cardNumber") REFERENCES "Card"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
