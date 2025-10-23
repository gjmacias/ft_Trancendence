import client from 'prom-client';

export class MetricsService {
    private static instance: MetricsService;
    private registry: client.Registry;
    
    // Métricas personalizadas
    private httpRequestDuration: client.Histogram<string>;
    private httpRequestsTotal: client.Counter<string>;
    private httpErrorsTotal: client.Counter<string>;
    private activeConnections: client.Gauge<string>;
    private gameSessionsActive: client.Gauge<string>;
    private registeredUsersTotal: client.Gauge<string>;
    private loginAttemptsTotal: client.Counter<string>;
    private gamesPlayedTotal: client.Counter<string>;
    private databaseConnections: client.Gauge<string>;
    private authTokensActive: client.Gauge<string>;
    private apiResponseSize: client.Histogram<string>;
    private walletTransactionsTotal: client.Counter<string>;
    private chatMessagesTotal: client.Counter<string>;

    private constructor() {
        this.registry = new client.Registry();
        
        // Métricas por defecto de Node.js
        client.collectDefaultMetrics({ 
            register: this.registry,
            prefix: 'transcendence_backend_'
        });

        this.initCustomMetrics();
    }

    public static getInstance(): MetricsService {
        if (!MetricsService.instance) {
            MetricsService.instance = new MetricsService();
        }
        return MetricsService.instance;
    }

    private initCustomMetrics(): void {
        // HTTP Request Metrics
        this.httpRequestDuration = new client.Histogram({
            name: 'transcendence_http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'route', 'status'],
            buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10]
        });

        this.httpRequestsTotal = new client.Counter({
            name: 'transcendence_http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status']
        });

        this.httpErrorsTotal = new client.Counter({
            name: 'transcendence_http_errors_total',
            help: 'Total number of HTTP errors (4xx, 5xx)',
            labelNames: ['method', 'route', 'status', 'error_type']
        });

        this.apiResponseSize = new client.Histogram({
            name: 'transcendence_api_response_size_bytes',
            help: 'Size of API responses in bytes',
            labelNames: ['method', 'route'],
            buckets: [100, 1000, 10000, 100000, 1000000]
        });

        // Connection Metrics
        this.activeConnections = new client.Gauge({
            name: 'transcendence_active_connections',
            help: 'Number of active HTTP connections'
        });

        this.databaseConnections = new client.Gauge({
            name: 'transcendence_database_connections_active',
            help: 'Number of active database connections'
        });

        // User & Authentication Metrics
        this.registeredUsersTotal = new client.Gauge({
            name: 'transcendence_users_registered_total',
            help: 'Total number of registered users'
        });

        this.loginAttemptsTotal = new client.Counter({
            name: 'transcendence_login_attempts_total',
            help: 'Total number of login attempts',
            labelNames: ['result', 'method'] // result: success/failure, method: oauth/password
        });

        this.authTokensActive = new client.Gauge({
            name: 'transcendence_auth_tokens_active',
            help: 'Number of active authentication tokens'
        });

        // Game Metrics
        this.gameSessionsActive = new client.Gauge({
            name: 'transcendence_game_sessions_active',
            help: 'Number of active game sessions',
            labelNames: ['game_type'] // pong, tournament, etc.
        });

        this.gamesPlayedTotal = new client.Counter({
            name: 'transcendence_games_played_total',
            help: 'Total number of games played',
            labelNames: ['game_type', 'result'] // result: completed, abandoned
        });

        // Chat Metrics
        this.chatMessagesTotal = new client.Counter({
            name: 'transcendence_chat_messages_total',
            help: 'Total number of chat messages sent',
            labelNames: ['channel_type'] // global, private, game
        });

        // Blockchain Metrics
        this.walletTransactionsTotal = new client.Counter({
            name: 'transcendence_wallet_transactions_total',
            help: 'Total number of wallet transactions',
            labelNames: ['transaction_type', 'status'] // type: reward, purchase, status: pending, confirmed, failed
        });

        // Registrar todas las métricas
        const metrics = [
            this.httpRequestDuration,
            this.httpRequestsTotal,
            this.httpErrorsTotal,
            this.apiResponseSize,
            this.activeConnections,
            this.databaseConnections,
            this.registeredUsersTotal,
            this.loginAttemptsTotal,
            this.authTokensActive,
            this.gameSessionsActive,
            this.gamesPlayedTotal,
            this.chatMessagesTotal,
            this.walletTransactionsTotal
        ];

        metrics.forEach(metric => this.registry.registerMetric(metric));
    }

    // HTTP Request Methods
    public recordHttpRequest(method: string, route: string, status: number, duration: number, responseSize?: number): void {
        const labels = { method, route, status: status.toString() };
        this.httpRequestsTotal.inc(labels);
        this.httpRequestDuration.observe(labels, duration);

        // Record errors for 4xx and 5xx status codes
        if (status >= 400) {
            const errorType = status >= 500 ? 'server_error' : 'client_error';
            this.httpErrorsTotal.inc({ method, route, status: status.toString(), error_type: errorType });
        }

        // Record response size if provided
        if (responseSize !== undefined) {
            this.apiResponseSize.observe({ method, route }, responseSize);
        }
    }

    // Connection Methods
    public setActiveConnections(count: number): void {
        this.activeConnections.set(count);
    }

    public setDatabaseConnections(count: number): void {
        this.databaseConnections.set(count);
    }

    // User & Authentication Methods
    public setRegisteredUsers(count: number): void {
        this.registeredUsersTotal.set(count);
    }

    public recordLoginAttempt(result: 'success' | 'failure', method: 'oauth' | 'password' = 'password'): void {
        this.loginAttemptsTotal.inc({ result, method });
    }

    public setActiveTokens(count: number): void {
        this.authTokensActive.set(count);
    }

    // Game Methods
    public setGameSessions(count: number, gameType: string = 'all'): void {
        this.gameSessionsActive.set({ game_type: gameType }, count);
    }

    public recordGamePlayed(gameType: string, result: 'completed' | 'abandoned'): void {
        this.gamesPlayedTotal.inc({ game_type: gameType, result });
    }

    // Chat Methods
    public recordChatMessage(channelType: 'global' | 'private' | 'game'): void {
        this.chatMessagesTotal.inc({ channel_type: channelType });
    }

    // Blockchain Methods
    public recordWalletTransaction(transactionType: 'reward' | 'purchase' | 'transfer', status: 'pending' | 'confirmed' | 'failed'): void {
        this.walletTransactionsTotal.inc({ transaction_type: transactionType, status });
    }

    // Utility Methods
    public async getMetrics(): Promise<string> {
        return this.registry.metrics();
    }

    // Method to update periodic metrics (call this regularly)
    public async updatePeriodicMetrics(): Promise<void> {
        try {
            // Here you would typically query your database for current counts
            // For now, we'll use placeholder logic
            
            // Update user count (you'd get this from your user service/database)
            // this.setRegisteredUsers(await getUserCount());
            
            // Update active tokens (you'd get this from your auth service)
            // this.setActiveTokens(await getActiveTokenCount());
            
            // Update database connections (you'd get this from your DB pool)
            // this.setDatabaseConnections(await getDatabaseConnectionCount());
            
        } catch (error) {
            console.error('Error updating periodic metrics:', error);
        }
    }
}