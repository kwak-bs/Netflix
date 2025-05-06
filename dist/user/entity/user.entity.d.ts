export declare enum Role {
    admin = 0,
    paidUser = 1,
    user = 2
}
export declare class User {
    id: number;
    email: string;
    password: string;
    role: Role;
}
