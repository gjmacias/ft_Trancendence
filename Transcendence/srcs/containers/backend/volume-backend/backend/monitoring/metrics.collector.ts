import { MetricsService } from './metrics.service';

/**
 * MetricsCollector reemplaza al antiguo generador sintético.
 * Recoge métricas reales mediante:
 *  - llamadas periódicas a `metricsService.updatePeriodicMetrics()`
 *  - métodos públicos que la aplicación debe invocar cuando ocurren eventos (HTTP, juegos, chat, etc.)
 */
export class MetricsCollector {
    private metricsService: MetricsService;
    private periodicIntervalMs: number;
    private periodicTimer?: NodeJS.Timeout;

    constructor(periodicIntervalMs: number = 15000) {
        this.metricsService = MetricsService.getInstance();
        this.periodicIntervalMs = periodicIntervalMs;
        this.startPeriodicCollection();
        console.log('📊 Metrics collector started - gathering real metrics');
    }

    private startPeriodicCollection(): void {
        // Llamadas periódicas para actualizar métricas que requieren polling (DB counts, etc.)
        this.periodicTimer = setInterval(async () => {
            try {
                await this.metricsService.updatePeriodicMetrics();
            } catch (err) {
                console.error('Error updating periodic metrics:', err);
            }
        }, this.periodicIntervalMs);
    }

    public stop(): void {
        if (this.periodicTimer) clearInterval(this.periodicTimer);
    }

    // --- Métodos públicos que la aplicación debe llamar ---
    // Registrar una petición HTTP (middleware del servidor)
    public recordHttpRequest(method: string, route: string, status: number, durationSeconds: number, responseSizeBytes?: number): void {
        this.metricsService.recordHttpRequest(method, route, status, durationSeconds, responseSizeBytes);
    }

    // Conexiones activas (por ejemplo, cada vez que se abre/cierra una conexión)
    public setActiveConnections(count: number): void {
        this.metricsService.setActiveConnections(count);
    }

    // Conteo de usuarios registrados (llamar desde user service)
    public setRegisteredUsers(count: number): void {
        this.metricsService.setRegisteredUsers(count);
    }

    // Login attempts
    public recordLoginAttempt(result: 'success' | 'failure', method: 'oauth' | 'password' = 'password'): void {
        this.metricsService.recordLoginAttempt(result, method);
    }

    // Juegos
    public setGameSessions(count: number, gameType: string = 'all'): void {
        this.metricsService.setGameSessions(count, gameType);
    }

    public recordGamePlayed(gameType: string, result: 'completed' | 'abandoned'): void {
        this.metricsService.recordGamePlayed(gameType, result);
    }

    // Chat
    public recordChatMessage(channelType: 'global' | 'private' | 'game'): void {
        this.metricsService.recordChatMessage(channelType);
    }

    // DB connections
    public setDatabaseConnections(count: number): void {
        this.metricsService.setDatabaseConnections(count);
    }

    // Wallet transactions
    public recordWalletTransaction(transactionType: 'reward' | 'purchase' | 'transfer', status: 'pending' | 'confirmed' | 'failed'): void {
        this.metricsService.recordWalletTransaction(transactionType, status);
    }

    // Obtener métricas en formato Prometheus text
    public async getMetricsText(): Promise<string> {
        return this.metricsService.getMetrics();
    }
}

