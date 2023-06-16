const { assert } = require('chai')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'nibin')
    })
  })

  describe("images",async ()=>{
    let result,count;
    const hash = 'abc'
    before(async ()=>{
      result = await decentragram.uploadImage(hash,"Description",{from:author});
      count = await decentragram.imgcount();
    })
    

    it("creates images",async ()=>{
      assert.equal(count,1)
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(),count,'id is correct');
         assert.equal(event.hash , hash ,'Hash is correct');
         assert.equal(event.description , 'Description' ,'Description is correct');
         assert.equal(event.tipAmount , '0' ,'Tipamount is correct');
         assert.equal(event.author , author ,'Author is correct');
         
         
         await decentragram.uploadImage('',"Description",{from:author}).should.be.rejected;
         await decentragram.uploadImage(hash,'',{from:author}).should.be.rejected;
        })
        
      it('lists images',async ()=>{
        const image = await decentragram.images(count)
        assert.equal(image.description , 'Description' ,'Description is correct');
        assert.equal(image.hash , hash ,'Hash is correct');
        assert.equal(image.tipAmount , '0' ,'Tipamount is correct');
        assert.equal(image.author , author ,'Author is correct');
      })

      it('allow users to tip iamges',async ()=>{
        let oldAuthorBalance;
        oldAuthorBalance  = await web3.eth.getBalance(author) 
        oldAuthorBalance  = new web3.utils.BN(oldAuthorBalance) 
        result = await decentragram.tipImageOwner(count,{from:tipper,value:web3.utils.toWei('1','Ether')})
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(),count,'id is correct');
        assert.equal(event.hash , hash ,'Hash is correct');
        assert.equal(event.description , 'Description' ,'Description is correct');
        assert.equal(event.tipAmount , '1000000000000000000' ,'Tipamount is correct');
        assert.equal(event.author , author ,'Author is correct');

        let newBalanceAuthor;
        newBalanceAuthor = await web3.eth.getBalance(author)
        newBalanceAuthor = new web3.utils.BN(newBalanceAuthor)

        let tip
        tip = web3.utils.toWei('1','Ether')
        tip = new web3.utils.BN(tip);

        const expected = oldAuthorBalance.add(tip)
        assert.equal(newBalanceAuthor.toString(),expected.toString())

        await decentragram.tipImageOwner(99,{from:tipper,value:web3.utils.toWei('1','Ether')}).should.be.rejected

      })

  })
        
})
        
        


