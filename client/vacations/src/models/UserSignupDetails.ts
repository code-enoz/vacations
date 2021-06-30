export default class UserSignupDetails {
    constructor(
        public username: string,
        public password: string,
        public firstName?: string,
        public familyName?: string
    ) {}
}