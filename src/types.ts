// src/types.ts

/* Server/Provider Types */
export type Provider = 'ninjaotp' | 'powersms';

export interface Server {
    id: string;
    name: string;
    provider: Provider;
}

/* API Response Shapes */
export type ApiResult<T> =
    | { status: 'success'; data: T }
    | { status: 'error'; message: string };

export type NumberResponse = {
    number: string;
    accessId: string;
    serviceId: string;
};

export type ServiceListResponse = {
    services: {
        id: string;
        name: string;
    }[];
};

/* App State */
export type AppPhase =
    | 'idle'
    | 'fetching_services'
    | 'fetching_numbers'
    | 'verifying';

export type AppStatus = {
    phase: AppPhase;
    currentServer: Server | null;
    retryCount: number;
    message: string;
};