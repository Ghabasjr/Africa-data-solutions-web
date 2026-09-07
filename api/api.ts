// ─── Base URL ────
export const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "/api/v1"
        : "https://api.africadatasolutions.org/api/v1");

export class ApiError extends Error {
    public status: number;
    public code?: string;
    public details?: any;
    public rawData?: any;

    constructor(message: string, status: number, code?: string, details?: any, rawData?: any) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.details = details;
        this.rawData = rawData;
    }
}


// ─── Auth ──

export interface RegisterRequest {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    twoFactorCode?: string;
}

export interface Wallet {
    id?: string;
    balance: number;
    currency: string;
}

export interface User {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    role?: 'USER' | 'ADMIN' | string;
    isActive?: boolean;
    isVerified?: boolean;
    twoFactorEnabled?: boolean;
    wallet?: Wallet;
    virtualAccount?: VirtualAccount;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    /** Present after a successful login (access JWT) */
    accessToken?: string;
    /** Present after a successful login (refresh JWT) */
    refreshToken?: string;
    refreshExpiresAt?: string;
    /** Legacy field – kept for backward compatibility */
    token?: string;
    user: User;
    virtualAccount?: VirtualAccount;
    /** True when the server requires a 2FA code before issuing tokens */
    twoFactorRequired?: boolean;
    twoFactorEnabled?: boolean;
}

// ─── Virtual Account ───

export interface VirtualAccount {
    id?: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
    accountReference: string;
    isActive?: boolean;
    createdAt?: string;
}

// ─── Data Plans ───

export interface DataPlan {
    id: string;
    name: string;
    price: string;
    networkId: number;
    network: string;
}

export interface NetworkPlans {
    network: string;
    networkId: number;
    plans: DataPlan[];
}

// ─── Data Orders ───

export interface DataOrder {
    id: string;
    phone: string;
    network: string;
    planName: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | string;
    reference: string;
    createdAt: string;
}

export interface GetDataOrdersParams {
    status?: 'PENDING' | 'COMPLETED' | 'FAILED';
    limit?: number;
    offset?: number;
}

// ─── Wallet Transactions ───

export interface Transaction {
    id: string;
    walletId?: string;
    type: 'CREDIT' | 'DEBIT';
    amount: number | string;
    balanceBefore?: number | string;
    balanceAfter?: number | string;
    reference: string;
    description: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt?: string;
}

export interface GetTransactionsParams {
    type?: 'CREDIT' | 'DEBIT';
    status?: 'PENDING' | 'COMPLETED' | 'FAILED';
    limit?: number;
    offset?: number;
}

export interface BillTransaction {
    id: string;
    reference: string;
    amount: number;
    fee: number;
    totalAmount: number;
    category: 'ELECTRICITY' | 'TV' | 'EDUCATION' | string;
    provider: string;
    customerID: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetBillHistoryParams {
    category?: 'ELECTRICITY' | 'TV' | 'EDUCATION';
    page?: number;
    limit?: number;
}

export interface BillHistoryResponse {
    bills: BillTransaction[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

// ─── Generic Wrapper ──

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}


/** Returns the stored JWT or null */
export const getToken = (): string | null =>
    localStorage.getItem("auth_token");

/** Saves the JWT to localStorage */
export const saveToken = (token: string): void =>
    localStorage.setItem("auth_token", token);

/** Removes the JWT from localStorage */
export const removeToken = (): void =>
    localStorage.removeItem("auth_token");

async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    let response: Response;
    try {
        response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (networkErr: any) {
        throw new Error(
            networkErr?.message === "Failed to fetch"
                ? "Unable to connect to the backend server. Please verify your connection or dev server proxy."
                : (networkErr?.message || "Network request failed")
        );
    }

    // Parse response body safely
    let data: any = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        try {
            data = await response.json();
        } catch {
            data = null;
        }
    } else {
        try {
            const text = await response.text();
            data = JSON.parse(text);
        } catch {
            data = null;
        }
    }

    // If HTTP error or backend returned explicit failure
    if (!response.ok || (data && typeof data === 'object' && data.success === false)) {
        // Extract the exact error message provided by the backend
        let errorMsg =
            data?.message ||
            data?.error?.message ||
            data?.error?.description ||
            (typeof data?.error === 'string' ? data.error : null);

        // If backend returned field validation details
        if (!errorMsg && data?.error?.details && typeof data.error.details === 'object') {
            const detailEntries = Object.entries(data.error.details);
            if (detailEntries.length > 0) {
                errorMsg = detailEntries
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join(', ');
            }
        }

        if (!errorMsg) {
            errorMsg = `Request failed with status ${response.status}`;
        }

        throw new ApiError(
            errorMsg,
            response.status,
            data?.error?.code,
            data?.error?.details,
            data
        );
    }

    return data as T;
}

// ──
// API FUNCTIONS
// ───

// ─── Auth ───

export const registerUser = (
    data: RegisterRequest
): Promise<ApiResponse<AuthResponse>> =>
    apiFetch<ApiResponse<AuthResponse>>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const loginUser = (
    data: LoginRequest
): Promise<ApiResponse<AuthResponse>> =>
    apiFetch<ApiResponse<AuthResponse>>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const logoutUser = (data: { refreshToken: string }): Promise<ApiResponse<{}>> =>
    apiFetch<ApiResponse<{}>>("/auth/logout", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const getMe = (): Promise<ApiResponse<User>> =>
    apiFetch<ApiResponse<User>>("/auth/me");

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export const updateProfile = (data: UpdateProfileRequest): Promise<ApiResponse<User>> =>
    apiFetch<ApiResponse<User>>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
    });

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export const changePassword = (data: ChangePasswordRequest): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const forgotPassword = (data: { email: string }): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const resetPassword = (data: { email: string, resetToken: string, newPassword: string }): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const createPin = (data: { pin: string }): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/auth/create-pin", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const changePin = (data: { currentPin: string, newPin: string }): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/auth/change-pin", {
        method: "POST",
        body: JSON.stringify(data),
    });

// ─── Virtual Accounts & Transactions ──

export interface CreateVirtualAccountRequest {
    bank: string; // e.g. "PALMPAY"
}

export interface CreatedVirtualAccount {
    accountNumber: string;
    accountName: string;
    bankName: string;
    reference: string;
}

export const createVirtualAccount = (
    data: CreateVirtualAccountRequest
): Promise<ApiResponse<CreatedVirtualAccount>> =>
    apiFetch<ApiResponse<CreatedVirtualAccount>>("/wallet/virtual-account/create", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const getVirtualAccounts = (): Promise<ApiResponse<VirtualAccount[]>> =>
    apiFetch<ApiResponse<VirtualAccount[]>>("/wallet/virtual-accounts");

// ─── Wallet Funding ───

export interface InitiateFundingRequest {
    amount: number;
}

export interface FundingInitiationData {
    reference: string;
    authorizationUrl: string;
    accessCode: string;
    amount: number;
}

export const initiateFunding = (
    data: InitiateFundingRequest
): Promise<ApiResponse<FundingInitiationData>> =>
    apiFetch<ApiResponse<FundingInitiationData>>("/wallet/fund/initiate", {
        method: "POST",
        body: JSON.stringify(data),
    });

export interface FundingVerificationData {
    status: string;
    transaction: Transaction;
}

export const verifyFunding = (
    reference: string
): Promise<ApiResponse<FundingVerificationData>> =>
    apiFetch<ApiResponse<FundingVerificationData>>(`/wallet/fund/verify/${reference}`);

export interface PaginationData {
    total?: number;
    limit?: number;
    offset?: number;
    hasMore?: boolean;
    page?: number;
    pages?: number;
}

export interface WalletDetails {
    id: string;
    balance: number;
    currency: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface WalletBalance {
    balance: number;
    currency: string;
}

export interface WalletTransactionsResponse {
    items: Transaction[];
    pagination?: PaginationData;
}

export const getWallet = (): Promise<ApiResponse<WalletDetails>> =>
    apiFetch<ApiResponse<WalletDetails>>("/wallet");

export const getWalletBalance = (): Promise<ApiResponse<WalletBalance>> =>
    apiFetch<ApiResponse<WalletBalance>>("/wallet/balance");

export const getTransactions = (params: GetTransactionsParams = {}): Promise<ApiResponse<WalletTransactionsResponse>> => {
    const parts: string[] = [];
    if (params.type) parts.push(`type=${params.type}`);
    if (params.status) parts.push(`status=${params.status}`);
    if (params.limit !== undefined) parts.push(`limit=${params.limit}`);
    if (params.offset !== undefined) parts.push(`offset=${params.offset}`);
    const qs = parts.length > 0 ? `?${parts.join('&')}` : '';
    return apiFetch<ApiResponse<WalletTransactionsResponse>>(`/wallet/transactions${qs}`);
};

export const getTransactionByReference = (reference: string): Promise<ApiResponse<Transaction>> =>
    apiFetch<ApiResponse<Transaction>>(`/wallet/transactions/${reference}`);

// ─── Data Plans ───

export interface PurchaseDataRequest {
    dataPlanId: string;
    phone: string;
}

export const getLiveDataPlans = (): Promise<ApiResponse<NetworkPlans[]>> =>
    apiFetch<ApiResponse<NetworkPlans[]>>("/data/plans/live");

export const getDataOrders = (params: GetDataOrdersParams = {}): Promise<ApiResponse<DataOrder[]>> => {
    const queryParts: string[] = [];
    if (params.status) queryParts.push(`status=${params.status}`);
    if (params.limit !== undefined) queryParts.push(`limit=${params.limit}`);
    if (params.offset !== undefined) queryParts.push(`offset=${params.offset}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : "";
    return apiFetch<ApiResponse<DataOrder[]>>(`/data/orders${queryString}`);
};

export const getDataOrderById = (id: string): Promise<ApiResponse<DataOrder>> =>
    apiFetch<ApiResponse<DataOrder>>(`/data/orders/${id}`);

export const getRawDataPlans = (): Promise<ApiResponse<unknown>> =>
    apiFetch<ApiResponse<unknown>>("/data/plans/raw");

export const getDataPlans = (
    networkId?: number
): Promise<ApiResponse<DataPlan[]>> => {
    const query = networkId !== undefined ? `?networkId=${networkId}` : "";
    return apiFetch<ApiResponse<DataPlan[]>>(`/data/plans${query}`);
};

export const getDataPlanById = (id: string): Promise<ApiResponse<DataPlan>> =>
    apiFetch<ApiResponse<DataPlan>>(`/data/plans/${id}`);

export const purchaseData = (data: PurchaseDataRequest): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/data/buy", {
        method: "POST",
        body: JSON.stringify(data),
    });

// ─── Airtime ───

export interface PurchaseAirtimeRequest {
    network: string;
    phone: string;
    amount: number;
    pin?: string;
    mobile?: string;
}

export interface PurchaseAirtimeResponseData {
    reference: string;
    vtpassRequestId?: string;
    phone: string;
    amount: number;
    network: string;
    status: string;
}

export interface AirtimeNetwork {
    id: string;
    name: string;
}

export type AirtimeNetworksResponse = AirtimeNetwork[];

export interface AirtimeOrder {
    id?: string;
    network?: string;
    phone?: string;
    amount?: number;
    reference?: string;
    vtpassRequestId?: string;
    status?: string;
    vtpassResponse?: Record<string, any>;
    failureReason?: string;
    deliveredAt?: string;
    createdAt?: string;
}

export interface AirtimeHistoryResponse {
    items: AirtimeOrder[];
    orders?: AirtimeOrder[];
    pagination?: PaginationData;
}

export const getAirtimeNetworks = (): Promise<ApiResponse<AirtimeNetwork[]>> =>
    apiFetch<ApiResponse<AirtimeNetwork[]>>("/airtime/networks");

export const getAirtimeHistory = (params: { page?: number; limit?: number } = {}): Promise<ApiResponse<AirtimeHistoryResponse>> => {
    const parts: string[] = [];
    if (params.page !== undefined) parts.push(`page=${params.page}`);
    if (params.limit !== undefined) parts.push(`limit=${params.limit}`);
    const qs = parts.length > 0 ? `?${parts.join('&')}` : '';
    return apiFetch<ApiResponse<AirtimeHistoryResponse>>(`/airtime/history${qs}`);
};

export const getAirtimeOrderByReference = (reference: string): Promise<ApiResponse<AirtimeOrder>> =>
    apiFetch<ApiResponse<AirtimeOrder>>(`/airtime/${reference}`);

export const purchaseAirtime = (data: PurchaseAirtimeRequest): Promise<ApiResponse<PurchaseAirtimeResponseData>> => {
    const payload = {
        network: data.network,
        phone: data.phone || data.mobile,
        amount: data.amount,
        ...(data.pin ? { pin: data.pin } : {}),
    };
    return apiFetch<ApiResponse<PurchaseAirtimeResponseData>>("/airtime/purchase", {
        method: "POST",
        body: JSON.stringify(payload),
    });
};

// ─── Bills ───

export interface BillProvider {
    id: string;
    name: string;
    category: string;
}

export interface BillPlan {
    id: string;
    name: string;
    amount: number;
}

export interface PayBillRequest {
    serviceType: string;
    providerId: string;
    customerId: string;
    planId?: string;
    amount?: number;
}

export interface ElectricityProvider {
    id: string;
    name: string;
    serviceID: string;
}

export interface ServiceVariation {
    variation_code: string;
    name: string;
    variation_amount: string;
    fixedPrice: string;
}

export interface ServiceVariationsResponse {
    serviceName?: string;
    serviceID?: string;
    convenienceFee?: string;
    variations: ServiceVariation[];
}

export interface VerifyMeterRequest {
    meterNumber: string;
    serviceID: string;
    type: string;
}

export interface VerifyMeterResponse {
    Customer_Name: string;
    Meter_Number: string;
    Address: string;
    [key: string]: any;
}

export interface PayElectricityRequest {
    meterNumber: string;
    serviceID: string;
    variationCode: string;
    amount: number;
    phone: string;
}

export interface TvProvider {
    id: string;
    name: string;
    serviceID: string;
}

export interface VerifySmartcardRequest {
    smartcardNumber: string;
    serviceID: string;
}

export interface VerifySmartcardResponse {
    Customer_Name: string;
    Smartcard_Number: string;
    [key: string]: any;
}

export interface PayTvRequest {
    smartcardNumber: string;
    serviceID: string;
    variationCode: string;
    amount: number;
    phone: string;
    subscriptionType: string;
}

export interface EducationProvider {
    id: string;
    name: string;
    serviceID: string;
}

export interface VerifyJambRequest {
    profileId: string;
    variationCode: string;
}

export interface VerifyJambResponse {
    Customer_Name: string;
    [key: string]: any;
}

export interface PayEducationRequest {
    serviceID: string;
    variationCode: string;
    amount: number;
    phone: string;
    quantity: number;
    profileId?: string;
}

export const getBillProviders = (category: string): Promise<ApiResponse<BillProvider[]>> =>
    apiFetch<ApiResponse<BillProvider[]>>(`/bills/providers?category=${category}`);

export const getBillPlans = (providerId: string): Promise<ApiResponse<BillPlan[]>> =>
    apiFetch<ApiResponse<BillPlan[]>>(`/bills/plans?providerId=${providerId}`);

export const payBill = (data: PayBillRequest): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/bills/pay", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const getBillsHistory = (params: GetBillHistoryParams = {}): Promise<ApiResponse<BillHistoryResponse>> => {
    const parts: string[] = [];
    if (params.category) parts.push(`category=${params.category}`);
    if (params.page !== undefined) parts.push(`page=${params.page}`);
    if (params.limit !== undefined) parts.push(`limit=${params.limit}`);
    const qs = parts.length > 0 ? `?${parts.join('&')}` : '';
    return apiFetch<ApiResponse<BillHistoryResponse>>(`/bills/history${qs}`);
};

export const getBillByReference = (reference: string): Promise<ApiResponse<BillTransaction>> =>
    apiFetch<ApiResponse<BillTransaction>>(`/bills/${reference}`);

// ─── Electricity Endpoints ───
export const getElectricityProviders = (): Promise<ApiResponse<ElectricityProvider[]>> =>
    apiFetch<ApiResponse<ElectricityProvider[]>>("/bills/electricity/providers");

export const getServiceVariations = (serviceID: string): Promise<ApiResponse<ServiceVariationsResponse>> =>
    apiFetch<ApiResponse<ServiceVariationsResponse>>(`/bills/variations/${serviceID}`);

export const verifyMeterNumber = (data: VerifyMeterRequest): Promise<ApiResponse<VerifyMeterResponse>> =>
    apiFetch<ApiResponse<VerifyMeterResponse>>("/bills/electricity/verify", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const payElectricityBill = (data: PayElectricityRequest): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/bills/electricity/pay", {
        method: "POST",
        body: JSON.stringify(data),
    });

// ─── TV Endpoints ───
export const getTvProviders = (): Promise<ApiResponse<TvProvider[]>> =>
    apiFetch<ApiResponse<TvProvider[]>>("/bills/tv/providers");

export const verifySmartcard = (data: VerifySmartcardRequest): Promise<ApiResponse<VerifySmartcardResponse>> =>
    apiFetch<ApiResponse<VerifySmartcardResponse>>("/bills/tv/verify", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const payTvSubscription = (data: PayTvRequest): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/bills/tv/pay", {
        method: "POST",
        body: JSON.stringify(data),
    });

// ─── Education Endpoints ───
export const getEducationProviders = (): Promise<ApiResponse<EducationProvider[]>> =>
    apiFetch<ApiResponse<EducationProvider[]>>("/bills/education/providers");

export const verifyJambProfile = (data: VerifyJambRequest): Promise<ApiResponse<VerifyJambResponse>> =>
    apiFetch<ApiResponse<VerifyJambResponse>>("/bills/education/verify", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const payEducationBill = (data: PayEducationRequest): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/bills/education/pay", {
        method: "POST",
        body: JSON.stringify(data),
    });

// ─── Notifications ───

export interface RegisterFcmTokenRequest {
    /** Minimum 32-character FCM device token */
    fcmToken: string;
}

export interface TestNotificationRequest {
    title: string;
    body: string;
}

export const registerFcmToken = (
    data: RegisterFcmTokenRequest
): Promise<ApiResponse<{ registered: boolean }>> =>
    apiFetch<ApiResponse<{ registered: boolean }>>("/notifications/register-token", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const removeFcmToken = (): Promise<ApiResponse<{ removed: boolean }>> =>
    apiFetch<ApiResponse<{ removed: boolean }>>("/notifications/token", {
        method: "DELETE",
    });

export const testNotification = (
    data: TestNotificationRequest
): Promise<ApiResponse<{ sent: boolean }>> =>
    apiFetch<ApiResponse<{ sent: boolean }>>("/notifications/test", {
        method: "POST",
        body: JSON.stringify(data),
    });