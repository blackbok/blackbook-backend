export interface IUserResponse {
    id: string;
    metadata: {
        name: string;
        email: string;
        role: string;
        address: {
            city: string;
            state: string;
            country: string;
            pincode: string;
        };
        createdAt: Date;
        updatedAt: Date;
    };
}