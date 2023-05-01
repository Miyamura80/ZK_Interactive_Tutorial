import Head from 'next/head'
import Link from 'next/link';
import { useState } from 'react';
import { Stack, Text, Title, Grid, Input, Button, Group, Space } from '@mantine/core'
import axios, { AxiosRequestConfig } from 'axios';
import { useAccount } from 'wagmi';
import { notifications } from "@mantine/notifications";
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { executeTransaction } from '@/lib/executeTransaction';
import { RocketButton } from '@/components/RocketButton';
import { RocketButton2 } from '@/components/RocketButton2';
import 'katex/dist/katex.min.css';
// import { Latex } from 'react-latex';
import 'katex/dist/katex.min.css';



export default function Home() {
  const [input0, setInput0] = useState("");
  const [input1, setInput1] = useState("");
  const [argmax, setArgmax] = useState(0);
  const { isConnected } = useAccount();
  const latexExpression = 'W \\mathbf{x} + \\mathbf{b}';
  const handleGenerateProofSendTransaction = async (e: any) => {
    e.preventDefault();
    
    // We will send an HTTP request with our inputs to our next.js backend to 
    // request a proof to be generated.
    const data = {
      input0,
      input1,
    }
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
      }
    }

    // Send the HTTP request
    try {
      const res = await axios.post("/api/generate_proof", data, config);
      notifications.show({
        message: "Proof generated successfully! Submitting transaction...",
        color: "green",
      });

      // Split out the proof and public signals from the response data
      const { proof, publicSignals } = res.data;
      console.log(publicSignals);
      const argmaxInt = parseInt(publicSignals,16);
      console.log(argmaxInt);
      setArgmax(argmaxInt);

      // Write the transaction
      const txResult = await executeTransaction(proof, publicSignals);
      const txHash = txResult.transactionHash;

      notifications.show({
        message: `Transaction succeeded! Tx Hash: ${txHash}`,
        color: "green",
        autoClose: false,
      });
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const errorMsg = err?.response?.data?.error;
      notifications.show({
        message: `Error ${statusCode}: ${errorMsg}`,
        color: "red",
      });
    }
  }

  // Only allow submit if the user first connects their wallet
  const renderSubmitButton = () => {
    if (!isConnected) {
      return <ConnectWalletButton />
    }
    return (
      // <RocketButton />
      <button type="submit" className="rounded-lg border border-violet-500 bg-violet-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-violet-700 hover:bg-violet-700 focus:ring focus:ring-violet-200 disabled:cursor-not-allowed disabled:border-violet-300 disabled:bg-violet-300">Calculate Credit Rating</button>
      // <Button type="submit">Generate Proof & Send Transaction</Button>
    )
  }

  return (
    <>
      <Head>
        <title>Mantle ZK-ML Verifier</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack justify="center" align="center" w="100vw" h="100vh" spacing={0}>
        <Stack align="center" spacing={0}>
          <Group w="96vw" h="10vh" position="apart" align="center">
            <Title order={3}>
              Mantle ZK-ML Verifier
            </Title>
            <ConnectWalletButton />
          </Group>
          <Grid align="center" justify="center" mih="80vh">
            <Grid.Col sm={8} md={6} lg={4}>
              <Text>
                {"This is an example credit rating algorithm that can \
                calculate a user's credit rating using a publicly known model\
                without revealing their income or debt."}
              </Text>
              {/* <Latex>{latexExpression}</Latex> */}
              <Space h={20} />
              <form onSubmit={handleGenerateProofSendTransaction}>
                <Stack spacing="sm">
                  <Input.Wrapper label="Income (£k)">
                    <Input 
                      placeholder="Income (£k)" 
                      value={input0} 
                      onChange={(e) => setInput0(e.currentTarget.value)}
                    />
                  </Input.Wrapper>
                  <Input.Wrapper label="Debt (£k)">
                  <Input 
                      placeholder="Debt (£k)" 
                      value={input1} 
                      onChange={(e) => setInput1(e.currentTarget.value)}
                    />
                  </Input.Wrapper>
                  <Space h={10} />
                  { renderSubmitButton() }
                </Stack>
              </form>
            </Grid.Col>
          </Grid>
          <Group w="96vw" h="10vh" position="center" align="center">
              <Text>
                Built with love in Oxford.
              </Text>

          </Group>
        </Stack>
      </Stack>
    </>
  )
}