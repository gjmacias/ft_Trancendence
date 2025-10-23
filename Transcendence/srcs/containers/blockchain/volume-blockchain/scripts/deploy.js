const hre = require("hardhat");

async function main() {
    try {
        let gameResult;
        try {
         gameResult = process.env.GAME_RESULT ? JSON.parse(process.env.GAME_RESULT) : {};
        } catch (e) {
            console.error("Failed to parse game result:", e.message);
            process.exit(1);
        }

        if (!gameResult.id || !gameResult.winner || !gameResult.second || !gameResult.rest) {
            console.error("Missing required game result. Expected format: { \"id\":1, \"winner\":\"Player1\",\"second\":\"Player2\",\"rest\":\"Player3,Player4\"}");
            process.exit(1);
        }

        console.log("Starting deployment with game result:", gameResult);

        // Get signer
        const [deployer] = await hre.ethers.getSigners();
        const balance = await hre.ethers.provider.getBalance(deployer.address);
        console.log("Deploying with account:", deployer.address);
        console.log("Account balance:", balance.toString());
        
        // Set default scores if not provided
        const rest = gameResult.rest || "";
        
        console.log("Deploying with parameters:", {
            id: gameResult.id,
            winner: gameResult.winner,
            second: gameResult.second,
            rest: gameResult.rest
        });
        
        // Deploy contract
        const PongScores = await hre.ethers.getContractFactory("PongScores");
        const pongScores = await PongScores.deploy(
            gameResult.id,
            gameResult.winner,
            gameResult.second,
            gameResult.rest
        );
        
        await pongScores.waitForDeployment();
        const contractAddress = pongScores.target;
        console.log("PongScores deployed to:", contractAddress);
        
        // Try to verify contract (don't exit if verification fails)
        console.log("Attempting to verify contract at:", contractAddress);
        try {
            await hre.run("verify:verify", {
                address: contractAddress,
                constructorArguments: [
                    gameResult.id,
                    gameResult.winner,
                    gameResult.second,
                    gameResult.rest
                ],
            });
            console.log("Verification successful!");
        } catch (verifyError) {
            if (verifyError.message.includes("Already Verified")) {
                console.log("Contract already verified");
            } else {
                console.log("Contract verification failed:", verifyError.message);
            }
        }
        
    } catch (error) {
        console.error("Deployment process failed:", error.message);
        process.exit(1);
    }
}

main();
