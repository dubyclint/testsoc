// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EscrowDeal {
    address public admin;
    uint256 public feePercent = 5;

    enum Status { Pending, Approved, Completed, Cancelled }

    struct Deal {
        address initiator;
        address receptor;
        uint256 amount;
        uint256 fee;
        Status status;
    }

    mapping(uint256 => Deal) public deals;
    uint256 public dealCounter;

    event DealCreated(uint256 dealId, address initiator, address receptor, uint256 amount);
    event DealApproved(uint256 dealId);
    event DealCompleted(uint256 dealId);
    event DealCancelled(uint256 dealId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createDeal(address receptor) external payable returns (uint256) {
        require(msg.value > 0, "Amount must be greater than 0");

        uint256 fee = (msg.value * feePercent) / 100;
        uint256 dealId = dealCounter++;

        deals[dealId] = Deal({
            initiator: msg.sender,
            receptor: receptor,
            amount: msg.value - fee,
            fee: fee,
            status: Status.Pending
        });

        emit DealCreated(dealId, msg.sender, receptor, msg.value);
        return dealId;
    }

    function approveDeal(uint256 dealId) external onlyAdmin {
        Deal storage deal = deals[dealId];
        require(deal.status == Status.Pending, "Invalid status");
        deal.status = Status.Approved;
        emit DealApproved(dealId);
    }

    function completeDeal(uint256 dealId) external onlyAdmin {
        Deal storage deal = deals[dealId];
        require(deal.status == Status.Approved, "Not approved");
        payable(deal.receptor).transfer(deal.amount);
        deal.status = Status.Completed;
        emit DealCompleted(dealId);
    }

    function cancelDeal(uint256 dealId) external onlyAdmin {
        Deal storage deal = deals[dealId];
        require(deal.status == Status.Pending || deal.status == Status.Approved, "Cannot cancel");
        payable(deal.initiator).transfer(deal.amount);
        deal.status = Status.Cancelled;
        emit DealCancelled(dealId);
    }

    function updateFee(uint256 newFeePercent) external onlyAdmin {
        require(newFeePercent <= 100, "Invalid fee");
        feePercent = newFeePercent;
    }
}
