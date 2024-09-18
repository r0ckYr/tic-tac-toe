import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addPlayerToGame(gameCode: string, playerName: string, walletAddress: string): Promise<boolean> {
  try {
    const updatedPaymentDetails = await prisma.paymentDetails.upsert({
      where: { gameCode },
      create: {
        gameCode,
        players: {
          create: {
            player: playerName,
            walletAddress,
          },
        },
      },
      update: {
        players: {
          create: {
            player: playerName,
            walletAddress,
          },
        },
      },
      include: { players: true },
    })
    
    console.log(`Player added to game ${gameCode}:`, updatedPaymentDetails)
    return true
  } catch (error) {
    console.error(`Error adding player to game ${gameCode}:`, error)
    return false
  }
}

async function getWalletAddress(gameCode: string, playerName: string): Promise<string | null> {
    try {
      const player = await prisma.player.findFirst({
        where: {
          paymentDetails: { gameCode },
          player: playerName,
        },
        select: { walletAddress: true },
      })
  
      if (!player) {
        console.log(`No player found for game code ${gameCode} and name ${playerName}`)
        return null;
      }
  
      console.log(`Wallet address for player ${playerName} in game ${gameCode}:`, player.walletAddress)
      return player.walletAddress;
    } catch (error) {
      console.error(`Error fetching wallet address for game ${gameCode} and player ${playerName}:`, error)
      return null;
    }
  }

  async function deleteGameAndPlayers(gameCode: string): Promise<boolean> {
    try {
      // First, delete all players associated with the game
      await prisma.player.deleteMany({
        where: {
          paymentDetails: {
            gameCode: gameCode
          }
        }
      });
  
      // Then, delete the game itself
      await prisma.paymentDetails.delete({
        where: { gameCode },
      });
  
      return true;
    } catch (error) {
      console.error(`Error deleting game ${gameCode} and associated players:`, error);
      return false;
    }
  }

export { 
  addPlayerToGame,
  getWalletAddress,
  deleteGameAndPlayers
}