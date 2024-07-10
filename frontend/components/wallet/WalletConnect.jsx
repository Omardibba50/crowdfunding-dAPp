import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@material-tailwind/react";
import { MainContext } from "../../context/MainContext";

const networks = {
  amoy: {
    chainId: `0x${Number(80002).toString(16)}`,
    chainName: "Polygon Amoy Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-amoy.polygon.technology/"],
    blockExplorerUrls: ["https://www.oklink.com/amoy"],
  },
};

export default function WalletConnect() {
  const { accountAddress, setAccountAddress } = useContext(MainContext);
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          console.log(accounts);
          setAccountAddress(accounts[0]);
          connectWallet();
          console.log("Account Changed");
        } else {
          setAccountAddress("");
          console.log(accounts);
          setBalance("");
          localStorage.removeItem("injected");
          console.log("Disconnected");
        }
      });
    }

    if (localStorage.getItem("injected")) {
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      // Check if connected to the correct network
      const network = await provider.getNetwork();
      if (network.chainId !== networks.amoy.chainId) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [networks.amoy],
        });
      }

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = ethers.utils.formatEther(await signer.getBalance());
      setAccountAddress(address);
      setBalance(balance);
      localStorage.setItem("injected", "web3");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error while connecting wallet: ", error);
    }
  };

  return (
    <div>
      {accountAddress.length > 2 ? (
        <div className="bg-slate-200 py-2.5 rounded-2xl pl-4 cursor-pointer">
          <span className="text-black">
            {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
          </span>
          <span className="bg-primary py-2.5 ml-4 px-3 rounded-2xl text-white">
            {balance.slice(0, 4)} MATIC
          </span>
        </div>
      ) : (
        <Button
          disabled={loading}
          className="flex items-center justify-center gap-x-2 bg-primary"
          onClick={connectWallet}
        >
          <AiOutlinePlus className="text-xl text-white" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
