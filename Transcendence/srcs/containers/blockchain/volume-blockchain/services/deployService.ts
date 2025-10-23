import path from 'path';
import axios from 'axios';

import { exec } from 'child_process';
import { promisify } from 'util';
import { INTERNAL_SECRET_BLOCKCHAIN } from '../config'; // Ajusta la ruta según tu estructura de carpetas
import { httpsAgent } from '../server';
import { PORT_BACKEND } from '../config';

const execAsync = promisify(exec);

interface GameResult {
  id: number;
  winner: string;
  second: string;
  rest: string;
}

interface DeploymentResult {
  success: boolean;
  id: number;
  address: string;
  timestamp: number;
  gameResult: GameResult;
  verified: boolean;
  verification: {
    status: string;
    message: string | null;
  };
  explorerLink: string;
}

export async function deployGameContract(gameResult: GameResult): Promise<DeploymentResult> {
  
  console.log('DEBUG: Deploying with game result:', gameResult);

  const hardhatProjectDir = path.resolve(__dirname, '..'); //Aquí apunta a blockchain/

  const command = `GAME_RESULT='${JSON.stringify(
    gameResult
  )}' npx hardhat run scripts/deploy.js --network fuji`;

  console.log('Executing:', command, 'in', hardhatProjectDir);

  try {
    const { stdout, stderr } = await execAsync(command, { cwd: hardhatProjectDir });

   //Imprime todo lo que devuelve el comando, para ver si la línea está en stdout o stderr
    console.log('Raw stdout:', JSON.stringify(stdout));
    console.log('Raw stderr:', JSON.stringify(stderr));

  //Une stdout y stderr para buscar la dirección en ambos
    const fullOutput = stdout + stderr;

    //Usa regex más flexible con espacio opcional y sin fijar el nombre exacto del contrato
    const addressMatch = fullOutput.match(/deployed to:\s*(0x[a-fA-F0-9]{40})/);

    //const addressMatch = stdout.match(/PongScores deployed to: (0x[a-fA-F0-9]{40})/);
    if (!addressMatch || !addressMatch[1]) {
      throw new Error('Could not find contract address in output');
    }

    const contractAddress = addressMatch[1];
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp

    const isVerified =
      stdout.includes('Verification successful') ||
      stdout.includes('Contract already verified');

    let verificationStatus = isVerified ? 'success' : 'failed';
    let verificationMessage: string | null = null;

    if (!isVerified) {
      if (stdout.includes('but no API token was found')) {
        verificationStatus = 'skipped';
        verificationMessage = 'API key not configured';
      } else if (stdout.includes('Contract verification failed')) {
        const match = stdout.match(/Contract verification failed: (.*?)(?=\n|$)/);
        verificationMessage = match ? match[1] : 'Unknown verification error';
      }
    }
	try {
		// Validar que existe el token antes de hacer la petición
		if (!INTERNAL_SECRET_BLOCKCHAIN) 
		{
			console.warn('INTERNAL_SECRET_BLOCKCHAIN not configured, skipping backend notification');
		} 
		else 
		{
			await axios.post
			(
				`https://backend:${PORT_BACKEND || 4000}/backend/blockchain/tournament`,
				{
					id: gameResult.id,
					contract_address: contractAddress,
					explorer_link: `https://testnet.snowtrace.io/address/${contractAddress}`,
				},
				{
					headers: {
					"Content-Type": "application/json",
					"blockchain-internal-token": INTERNAL_SECRET_BLOCKCHAIN,
					},
					httpsAgent,
				}
			);
			console.log(`Sent blockchain data to backend for tournament ID: ${gameResult.id}`);
		}
    }
	catch (fetchError) 
	{
		console.error('Failed to send data to backend:', fetchError);   
    }

    return {
      success: true,
      id: gameResult.id,
      address: contractAddress,
      timestamp: timestamp,
      gameResult,
      verified: isVerified,
      verification: {
        status: verificationStatus,
        message: verificationMessage,
      },
      explorerLink: `https://testnet.snowtrace.io/address/${contractAddress}`,
    };
  } catch (error: any) {
    throw new Error(
      `Deployment failed: ${error.stderr || error.message || 'Unknown error'}`
    );
  }
}
