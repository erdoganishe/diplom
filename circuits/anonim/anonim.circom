pragma circom 2.1.6;

include "../circomlib/poseidon.circom";
include "../SMTVerifier.circom";

template AnonimizeTx(N_LEVELS){
    signal input secret;
    signal input nullifier;
    signal input nullifierHash;
    signal input root;
    signal input inclusionProof[N_LEVELS];

    component SMT = SMTVerifier(N_LEVELS);
    SMT.root <== root;
    SMT.leaf <== secret;
    SMT.key <== nullifier;
    SMT.siblings <== inclusionProof;
    SMT.isVerified === 1;

    component hasher = Poseidon(2);
    hasher.inputs[0] <== secret;
    hasher.inputs[1] <== nullifier;

    hasher.out === nullifierHash;

}