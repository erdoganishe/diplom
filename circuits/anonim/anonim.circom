pragma circom 2.1.6;

include "../circomlib/poseidon.circom";

template AnonimizeTx(N_LEVELS){
    signal input secret;
    signal input nullifier;
    signal input nullifierHash;
    signal input root;
    signal input inclusionProof[N_LEVELS];

    //Add smt logic;

    component hasher = Poseidon(2);
    hasher.inputs[0] <== secret;
    hasher.inputs[1] <== nullifier;

    hasher.out === nullifierHash;

}