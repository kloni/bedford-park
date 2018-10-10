export interface CurrentUser {
    WCTrustedToken: string;
    WCToken: string;
    isGuest?: boolean;
    isGoingToCheckout?: boolean;
    isCheckoutAsGuest?: boolean;
    personalizationID?: string;
    username?: string;
    userId?: string
    isCSR: boolean;
    forUser?:any;
}