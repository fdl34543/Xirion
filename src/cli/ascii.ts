import chalk from "chalk";

export function showLogo() {
  console.clear();
  console.log(
    chalk.cyanBright(`
██╗  ██╗██╗██████╗ ██╗ ██████╗ ███╗   ██╗
╚██╗██╔╝██║██╔══██╗██║██╔═══██╗████╗  ██║
 ╚███╔╝ ██║██████╔╝██║██║   ██║██╔██╗ ██║
 ██╔██╗ ██║██╔══██╗██║██║   ██║██║╚██╗██║
██╔╝ ██╗██║██║  ██║██║╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
`)
  );
  console.log(chalk.gray("Xirion is a Solana-native autonomous agent for\non-chain intelligence, market analysis, and\noptional execution across crypto and prediction markets.\n"));
}
