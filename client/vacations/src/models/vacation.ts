export default class Vacation {
    constructor(
        // public id: number,
        public description: string,
        public destination: string,
        public imageUrl: string,
        // public image_url: string,
        public departureDate: string,
        public returnDate: string,
        public price: number,
        public id?: number,
        public followersAmount?: number,
        public isFollowed?: boolean
    ) {}
}