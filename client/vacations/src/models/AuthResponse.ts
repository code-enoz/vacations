export class AuthResponse{

public constructor(
    public authToken: string,
    public userType: string,
    public firstName: string
    ) {}

}