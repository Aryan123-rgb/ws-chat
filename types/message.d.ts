export interface ChatMessage {
    id: string;
    content: string;
    userName: string;
    isCurrentUser: boolean;
}

export interface UserInterface {
    id: string;
    email: string;
    name: string;
}