export enum UserType {
    None = 0,
    Admin = 1,
    Developer = 2,
    Owner = 3
}

export interface ChannelInformation {
    identifier: string;
    title: string;
    messages: Message[];
    users: User[];
    persistant: boolean;
}

export interface Message {
    dateTime: Date;
    userName: string;
    text: string;
    channelIdentifier: string;
}

export interface User {
    type: UserType;
    name: string;
}

export interface ChatInformation {
    channels: ChannelInformation[];
}

export interface UserChangeEvent {
    userName: string;
    channelIdentifier: string;
}