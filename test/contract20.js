const contract20 = artifacts.require('./contract20.sol')
const assert = require('assert')

let contractInstance

contract('Contract20', (accounts) => {
    beforeEach(async () => {
       contractInstance = await contract20.deployed()
    })

    it('should add a to-do note successfully with a short text of 20 letters', async () => {
        await contractInstance.addTodo(web3.toHex('this is a short text'))
  
        const newAddedTodo = await contractInstance.todos(accounts[0], 0)
        const todoContent = web3.toUtf8(newAddedTodo[1])
        
        assert.equal(todoContent, 'this is a short text', 'The content of the new added todo is not correct')
     })
 })