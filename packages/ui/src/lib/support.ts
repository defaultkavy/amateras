export const support = (key: string, value: string, fallback: string) => ({
    [key]: value,
    [`@support not (${key}: ${value})`]: {
        [key]: fallback
    }
})