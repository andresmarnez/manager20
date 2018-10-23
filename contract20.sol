pragma solidity ^0.4.25;

/// @title ERC20 token example by Andres Sanchez Martinez

//Based on OpenZeppeling MathSafe library for 
//Check for overflow or underflow using require function to revert changes instead of assertion
contract SafeMath{

    function safeAdd(uint256 a, uint256 b) internal pure returns (uint256){
        uint256 c = a+b;
        require((c>=a) && (c>=b),"Logical problem");
        return c;
    }

    function safeMinus(uint256 a, uint256 b) internal pure returns(uint256){
        require(a>=b, "Logical problem");
        uint256 c = a-b;
        return c;
    }

    function safeMult(uint256 a, uint256 b) internal pure returns(uint256){
        if(a==0) return 0;
        uint256 c = a*b;
        require (c/a == b,"Logical problem");
        return c;
    }
}

//Defining main functions according to the standard.
contract ERC20{

    function balanceOf(address _owner) public view returns (uint256 balance);
    function transfer(address _to, uint256 _value) public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    function approve(address _spender, uint256 _value) public returns (bool success);


    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);


}

contract Token is Token20, SafeMath{

    //Public variables of the token
    string public name;
    uint8 public decimals;
    string public symbol;
    mapping (address => uint256) balances;
    address public creator;

    
    //Constructor of our token, it will be simple due to the porpuose of demostration
    function Token(){

        name = "SlackToken";
        decimals = 2;
        symbol = "STK";
        creator = msg.sender;
        balances[msg.sender] = 10000;
    }
   


}