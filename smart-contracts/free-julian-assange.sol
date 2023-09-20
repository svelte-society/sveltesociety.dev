// This currency shall foster freedom, fairness, peace and love   
// This currency shall help to free people who have been unlawfully framed and imprisoned    

// I write the following code in a way that everyone shall be able to understand it     
// Please share your feedback regarding security, readability, performance, low gas fees and tokenomics with the CULT community     
// Please always make sure you are connected with the right blockchain and that you interact with the right smart contract     
// Claim your rewards regularly - see claimCurrentlyAvailableLiquidityBackedMaxRewards
// Please do not trust anyone specifically too much especially if they pretend to be me the developer of this smart contract     

// SPDX-License-Identifier: GNU GPL v3
pragma solidity 0.8.9; 

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FreeJulianAssange is ERC20 {

    uint256 public fixedSupply = 24000000; // There is a fixed supply of 24.000.000 Coins
    uint256 public numberOfFreedomFans = 0; // initializing the numberOfFreedomFans at the beginning of the project
    uint256 public numberOfApprovedFreedomFans = 0; // initializing the numberOfApprovedFreedomFans at the beginning of the project
    uint256 public currentThresholdForBecomingFullyApproved = 1; // this threshold increases proportionally to the number of approved FreedomFans - modulus is also here :)

    struct FreedomFan { // this structure represents the core data which is stored for each Freedom Fan
        address walletAddress;
        string proofLink;
        uint256 appliedOn;
        uint256 approvedOn;
        uint256 amountOfReceivedApprovals;
    }

    mapping(address => uint256) public ids; // this mapping is used to optimize the performance of some functions of this smart contract
    mapping(uint256 => FreedomFan) public freedomFans; // in this mapping we store the core data per id of each Freedom Fan
    mapping(address => address[]) public approversForFreedomFan; // in this mapping we store the approvers of each Freedom Fan
    mapping(address => uint256) public ethLiquidityProviders;  // in this mapping we store how much ETH liquidity each Freedom Fan provided
    mapping(address => uint256) public maxRewardPerFreedomFan;  // in this mapping we store how much reward each freedom fan can claim if the liquidity is sufficient 
    
    address projectStarter = 0xb18871eFb8a6C3c6b628160efbBa5c1eB35B7c49; //  this is needed for the startProject function - see below

    bool projectAlreadyStarted = false;
    
    event LOGMessage(string); // whenever we want to log any text, we can emit this event
    
    constructor() ERC20("FreeJulianAssange", "JULIAN") {
        // with the following all 24.000.000 coins are transferred to this contract itself.
        _mint(address(this), fixedSupply * (10 ** decimals())); 
    }

    // The following modifiers are executed as checks before specific functions (see then further below) to protect the correct flow
    modifier avoidDuplicateApprovals(address freedomFan) { 
        for (uint256 i = 0; i < approversForFreedomFan[freedomFan].length; i++) {
            require(approversForFreedomFan[freedomFan][i] != msg.sender, "we avoid duplicate approvals from one approver for one freedom fan.");
        }   
        _; 
    }
    modifier onlyNotYetApprovedFreedomFansCanBeApproved(address freedomFan) {
        require(freedomFans[ids[freedomFan]].approvedOn == 0, "only not yet approved freedom fans can be approved.");
        _;
    }

    // Freedom Fans can join by sending a prooflink to proof they love freedom, fairness & peace
    function joinFreedomFans(string memory proofLink) external {        
        updateNumberOfFreedomFansAndIDs(msg.sender);
        updateCoreDataForFreedomFan(msg.sender, proofLink);
    }

    function updateNumberOfFreedomFansAndIDs(address newFreedomFan) public {
        require(ids[newFreedomFan] == 0, "this wallet already has an id.");
        numberOfFreedomFans = numberOfFreedomFans + 1; 
        ids[newFreedomFan] = numberOfFreedomFans;  
    }

    function updateCoreDataForFreedomFan(address newFreedomFan, string memory proofLink) public {
        freedomFans[numberOfFreedomFans].walletAddress = newFreedomFan; 
        freedomFans[numberOfFreedomFans].proofLink = proofLink;
        freedomFans[numberOfFreedomFans].appliedOn = block.timestamp;
        freedomFans[numberOfFreedomFans].approvedOn = 0; // not yet approved 
        freedomFans[numberOfFreedomFans].amountOfReceivedApprovals = 0; 
    }

    // As soon as a new Freedom Fan is fully approved, he and his approvers are eligible to receive a reward until all Coins are distributed
    function approveFreedomFan(address freedomFan) public avoidDuplicateApprovals(freedomFan) onlyNotYetApprovedFreedomFansCanBeApproved(freedomFan) {
        require(freedomFans[ids[msg.sender]].approvedOn > 0 || projectAlreadyStarted == false, "only approved freedom fans or the project starter at the beginning can do that.");

        freedomFans[ids[freedomFan]].amountOfReceivedApprovals++; 
        freedomFans[numberOfFreedomFans].amountOfReceivedApprovals = 1; 
        approversForFreedomFan[msg.sender].push(address(this)); 
        numberOfApprovedFreedomFans = numberOfApprovedFreedomFans + 1;

        if (freedomFans[ids[freedomFan]].amountOfReceivedApprovals >= currentThresholdForBecomingFullyApproved) {
            freedomFans[ids[freedomFan]].approvedOn = block.timestamp;
            if (balanceOf(address(this)) >= (24 * (10 ** 18))) {
                maxRewardPerFreedomFan[freedomFan] = 24 * (10 ** decimals()); // welcome gift to new freedom fan
            } else {
                emit LOGMessage("the fixed supply of overall 24.000.000 Coins / the balanceOf FREE of this contract does not allow welcome gifts atm. new approved freedom fans might invest in FREE via the buy function.");
            }

            for (uint i = 0; i < approversForFreedomFan[freedomFan].length; i++) {
                if (balanceOf(address(this)) >= (1 * (10 ** 18))){
                        maxRewardPerFreedomFan[approversForFreedomFan[freedomFan][i]] = maxRewardPerFreedomFan[approversForFreedomFan[freedomFan][i]] + 1 * (10 ** decimals());
                } else {
                    emit LOGMessage("the fixed supply of overall 24.000.000 Coins / the balanceOf FREE does not allow direct rewards for approvers atm. the incentives should anyways be high enough to continue approving wisely.");
                }
            }
            if ((currentThresholdForBecomingFullyApproved % 2) == 0){ 
                currentThresholdForBecomingFullyApproved++; 
            }
        }
    }

    // The reason why I do not automatically send the rewards is that I think it is fair that the receiver of the rewards pays the gas fees
    function claimCurrentlyAvailableLiquidityBackedMaxRewards() public {
        uint256 amountToBeTransferred;
        if (balanceOf(address(this)) >= maxRewardPerFreedomFan[msg.sender]) {
            amountToBeTransferred = maxRewardPerFreedomFan[msg.sender];
        } else {
            amountToBeTransferred = balanceOf(address(this));
        }
        this.transfer(msg.sender, amountToBeTransferred);
        maxRewardPerFreedomFan[msg.sender] = maxRewardPerFreedomFan[msg.sender] - amountToBeTransferred;
    }

    // the following funciton can only be executed once by the projectStarter. 
    function startProject() public { 
        require(projectAlreadyStarted == false && projectStarter == msg.sender, "why would you call this function now?");
        updateNumberOfFreedomFansAndIDs(msg.sender);
        updateCoreDataForFreedomFan(msg.sender, "https://twitter.com/Peer2peerE/status/1695323724646322412");
        approveFreedomFan(msg.sender);
        projectAlreadyStarted = true;
    }


    // buy and sell here is designed to:  
    // 1. be free from rather limiting dependencies and fees from liquidity pools, cexes and dexes      
    // 2. restrict max buying amount per holder to 1 Finney to support long term decentralization & fairness    
    // 3. ensure the price is defined by the network size and by the value of the network   
    function buy() public payable  { 
        require(freedomFans[ids[msg.sender]].approvedOn > 0, "only approved freedom fans can do that.");
        require(msg.value <= 1 * 10 ** 15, "you can buy for a maximum of one finney which is 0.001 ETH. chancellor on brink of second bailout for banks :)"); // this is meant to foster decentralization 
        require(msg.value + ethLiquidityProviders[msg.sender] <=  1 * 10 ** 15, "you can overall buy for a maximum of one finney which is 0.001 ETH. it seems you invested already earlier.");
        uint256 priceOfOneFREEInWEI = numberOfApprovedFreedomFans * (10**18) / 1000000000; // the more approved freedom fans there are, the higher the value of FREE
        uint256 amountToBeTransferred = (msg.value / priceOfOneFREEInWEI) * (10**18);
        require(balanceOf(address(this)) >= amountToBeTransferred, "you cannot buy that many at the moment via this function. buy from your neighbor if possible.");
        this.transfer(msg.sender, amountToBeTransferred); 
    }

    function sell(uint256 amountInWEI) external {
        require(freedomFans[ids[msg.sender]].approvedOn > 0, "only approved freedom fans can do that.");
        require(balanceOf(msg.sender) >= amountInWEI, "this smart contract does not support selling more than you have.");    
        require(allowance(msg.sender, address(this)) >= amountInWEI, "please set an appropriate allowance first.");    
        IERC20(address(this)).transferFrom(msg.sender, address(this), amountInWEI); 
        uint256 amountInWEIToBeSent = 1000000000 / numberOfApprovedFreedomFans;
        require(address(this).balance >= amountInWEIToBeSent, "this smart contract does not have enough ETH liquidity available for this deal atm.");
        payable(msg.sender).transfer(amountInWEIToBeSent);
    }

}

// The blockchain technology as distributed ledger technology will gain appreciation even further once people appreciate their neighbours and everyone who loves freedom, fairness and peace even more imo.  
// fun facts: https://github.com/michael-spengler/distributed-ledger-technology-hands-on-lecture/blob/main/fun-facts/bitcoin-related-fun-facts.md  