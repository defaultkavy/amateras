export type MetaConfig = {
    description?: string;
    og?: {
        title?: string;
        type?: string;
        image?: string | string[] | OpenGraphMediaConfig | OpenGraphMediaConfig[];
        url?: string;
        audio?: string | string[] | OpenGraphAudioConfig | OpenGraphAudioConfig[];
        description?: string;
        determiner?: string;
        locale?: string | {
            alternate?: string;
        };
        site_name?: string;
        video?: string | string[] | OpenGraphVideoConfig | OpenGraphVideoConfig[];
    }
    twitter?: {
        card?: 'summary' | 'summary_large_image' | 'app' | 'player';
        site?: `@${string}`;
        creator?: `@${string}`;
    }
}

export type OpenGraphMediaConfig = {
    url?: string;
    secure_url?: string;
    type?: string;
    width?: string;
    height?: string;
    alt?: string;
}

export type OpenGraphAudioConfig = Pick<OpenGraphMediaConfig, 'url' | 'secure_url' | 'type'>;
export type OpenGraphVideoConfig = Omit<OpenGraphMediaConfig, 'alt'>

export type MetaOutput = {property: string, content: string} | {name: string, content: string};