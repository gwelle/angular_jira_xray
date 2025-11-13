export interface ResendResponse {
    status: 'handled' | 'resend' | 'error';
    info?: string;
    error?: string;
}