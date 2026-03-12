// ─── Base URL ────
export const BASE_URL = "https://africa-data-solution-backend.onrender.com/api/v1";


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
}

export interface Wallet {
    balance: number;
    currency: string;
}

export interface User {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    wallet?: Wallet;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    virtualAccount?: VirtualAccount;
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
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    reference: string;
    description: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
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

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(
            json?.message || `Request failed with status ${response.status}`
        );
    }

    return json as T;
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

export const getVirtualAccounts = (): Promise<ApiResponse<VirtualAccount[]>> =>
    apiFetch<ApiResponse<VirtualAccount[]>>("/wallet/virtual-accounts");

export const getTransactions = (params: GetTransactionsParams = {}): Promise<ApiResponse<Transaction[]>> => {
    const parts: string[] = [];
    if (params.type) parts.push(`type=${params.type}`);
    if (params.status) parts.push(`status=${params.status}`);
    if (params.limit !== undefined) parts.push(`limit=${params.limit}`);
    if (params.offset !== undefined) parts.push(`offset=${params.offset}`);
    const qs = parts.length > 0 ? `?${parts.join('&')}` : '';
    return apiFetch<ApiResponse<Transaction[]>>(`/wallet/transactions${qs}`);
};

export const getTransactionByReference = (reference: string): Promise<ApiResponse<Transaction>> =>
    apiFetch<ApiResponse<Transaction>>(`/wallet/transactions/${reference}`);

// ─── Data Plans ───

export interface PurchaseDataRequest {
    planId: string;
    phoneNumber: string;
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
    networkId: number;
    amount: number;
    phoneNumber: string;
}

export interface AirtimeNetworksResponse {
    status: boolean;
    networks: Record<string, string>;
}

export interface AirtimeOrder {
    id?: string;
    status?: string;
    amount?: number;
    network?: string;
    phone?: string;
    reference?: string;
    createdAt?: string;
}

export interface AirtimeHistoryResponse {
    orders: AirtimeOrder[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export const getAirtimeNetworks = (): Promise<ApiResponse<AirtimeNetworksResponse>> =>
    apiFetch<ApiResponse<AirtimeNetworksResponse>>("/airtime/networks");

export const getAirtimeHistory = (params: { page?: number; limit?: number } = {}): Promise<ApiResponse<AirtimeHistoryResponse>> => {
    const parts: string[] = [];
    if (params.page !== undefined) parts.push(`page=${params.page}`);
    if (params.limit !== undefined) parts.push(`limit=${params.limit}`);
    const qs = parts.length > 0 ? `?${parts.join('&')}` : '';
    return apiFetch<ApiResponse<AirtimeHistoryResponse>>(`/airtime/history${qs}`);
};

export const getAirtimeOrderByReference = (reference: string): Promise<ApiResponse<AirtimeOrder>> =>
    apiFetch<ApiResponse<AirtimeOrder>>(`/airtime/${reference}`);

export const purchaseAirtime = (data: PurchaseAirtimeRequest): Promise<ApiResponse<any>> =>
    apiFetch<ApiResponse<any>>("/airtime/purchase", {
        method: "POST",
        body: JSON.stringify(data),
    });

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

export const getServiceVariations = (serviceID: string): Promise<ApiResponse<ServiceVariation[]>> =>
    apiFetch<ApiResponse<ServiceVariation[]>>(`/bills/variations/${serviceID}`);

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