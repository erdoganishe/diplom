// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Groth16Verifier} from "./verifier.sol";  // Adjust path to your verifier contract

contract RewardValidProof is Groth16Verifier {
    uint256 public constant REWARD_AMOUNT = 0.01 ether;

    event Deposit(uint256 leaf, address sender, uint256 value);

    mapping(uint256 => bool) usedNullifiers;

    // Allow contract to receive ETH to fund rewards
    receive() external payable {}

    // Verify proof and send reward if valid
    function verifyAndReward(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[2] calldata _pubSignals
    ) external {
        bool isValid = verifyProof(_pA, _pB, _pC, _pubSignals);

        uint256 treeRoot = _pubSignals[0];
        uint256 nullifier = _pubSignals[1];

        require(!usedNullifiers[nullifier], "Nullifier has been used already");
        usedNullifiers[nullifier] = true;

        require(isValid, "Invalid proof");

        require(address(this).balance >= REWARD_AMOUNT, "Insufficient contract balance");
        
        // Send reward to the sender
        (bool sent, ) = msg.sender.call{value: REWARD_AMOUNT}("");
        require(sent, "Failed to send reward");
    }

    function deposit(uint256 leaf) external payable {
        require(msg.value >= REWARD_AMOUNT, "Not enough ETH sent");

        emit Deposit(leaf, msg.sender, msg.value);
    }
}
