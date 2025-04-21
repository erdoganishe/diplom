pragma circom 2.1.6;

include "./anonim.circom";

component main{public [root, nullifierHash]} = AnonimizeTx(20);