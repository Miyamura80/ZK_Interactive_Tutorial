# ZK_Interactive_Tutorial

![image](https://user-images.githubusercontent.com/38335479/235347640-6aef7a09-1029-42a9-bb3f-05519bc98ff4.png)

# Updating the circom circuits

1. (From circuits) `circom simple_multiplier.circom --r1cs --wasm --sym -o build`
2. (From circuits) `snarkjs plonk setup build/simple_multiplier.r1cs ptau/powersOfTau28_hez_final_08.ptau build/proving_key.zkey`
3. (From project root:) `snarkjs zkey export solidityverifier circuits/build/proving_key.zkey contracts/src/PlonkVerifier.sol`


