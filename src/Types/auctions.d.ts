type Auction = {
    /**
     * Auction ID
     */
    auctionId: number
    /**
     * Auction Title
     */
    title: string
    /**
     * Auction Cat Id
     */
    categoryId: number
    /**
     *Auction seller Id
     */
    sellerId: number
    /**
     *Auction seller's first name
     */
    sellerFirstName: string
    /**
     *Auction sellers last name
     */
    sellerLastName: string
    /**
     * Reserve number
     */
    reserve: number
    /**
     * Number of bids
     */
    numBids: number
    /**
     * Highest bid
     */
    highestBid: number
    /**
     * end Date
     */
    endDate: string
}
