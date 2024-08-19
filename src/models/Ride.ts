interface Ride {
    id: string;
    cardNumber: string;
    entryStation: string;
    exitStation?: string;
    fare?: number;
    timestamp: Date;
}